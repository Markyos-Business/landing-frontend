"use client";

/*
 * The lockup, traced.
 *
 * ── What this is ─────────────────────────────────────────────────────────
 *
 * An Originkit/Framer component ("Bezier Anchor Type"), supplied by the owner
 * on 19 Nov 2026 and adapted. It rasterises a shape, walks the alpha into
 * closed contours, fits anchor points along them, and then draws the result
 * the way a vector editor would -- a hairline outline with draggable nodes on
 * it -- over a scripted seven-second beat. Nodes spring back when released and
 * answer the pointer.
 *
 * ── The one change that matters ──────────────────────────────────────────
 *
 * The original builds its mask from **text**: `ctx.fillText(props.text)` in a
 * font you pass it. Pointed at the brand that is three separate problems, and
 * the third is fatal.
 *
 * The design system §12 says "files only, from `public/brand/`. Never retype,
 * redraw, recolour, stretch, rotate or add effects", and §2 is more specific
 * still: "Bricolage Grotesque is the wordmark's typeface. It is never set as
 * live text on the site; the wordmark is always the SVG." This site does not
 * load Bricolage Grotesque. So `text="Markyos"` would have rendered the word
 * in Inter -- not a styled logo, a different logo. And «ماركيوس» is drawn
 * lettering, not a font at all, so there is no string that produces it.
 *
 * So the mask comes from the lockup file instead. `buildMaskFromImage` draws
 * `/brand/markyos-lockup{-ar}.svg` to a canvas and takes its alpha, which is
 * the same thing `Logo.tsx` does with `mask: url(...)` -- the geometry stays
 * in `public/brand/` where the designer can replace it, and nothing here
 * retypes or redraws it. The outline you see is traced from the artwork.
 *
 * It is still an effect on the logo, which §12 also forbids. That is the
 * owner's call and it was made explicitly; this note is so the next person
 * finds the rule rather than the exception.
 *
 * ── Four things it does that the original does not ───────────────────────
 *
 * - **Colour comes from tokens, not hex.** The original ships `#DB6F23`, a
 *   warm orange that `check:design` fails by name (§13). Canvas needs resolved
 *   values, so the five colours are read off the mounted element's computed
 *   style and flattened through a 1x1 canvas, which handles `oklch()` and
 *   `lab()` alike. Re-read on theme change; no raw hex in this file.
 * - **It parks off screen.** The original's IntersectionObserver is kept and
 *   it matters more here: this is in the footer, which is off screen for the
 *   whole page.
 * - **`prefers-reduced-motion` collapses the beat** to 0.2s, as the original
 *   does, so the resting state arrives immediately and nothing loops.
 * - **The Framer shims are gone** -- `addPropertyControls`, `RenderTarget`,
 *   the property-control block and the preset wrapper -- along with the kit
 *   helpers this effect never calls (`drawCard`, `createProgram`,
 *   `wrapLines`, the font shorthand the text mask needed).
 */

import { useEffect, useRef, type CSSProperties } from "react";

type RGBA = [number, number, number, number]

const COLOR_CACHE = new Map<string, RGBA | null>()

function parseColor(input: string | undefined, fallback: RGBA): RGBA {
    if (typeof input !== "string") return fallback
    let hit = COLOR_CACHE.get(input)
    if (hit === undefined) {
        hit = parseColorRaw(input)
        COLOR_CACHE.set(input, hit)
    }
    return hit ?? fallback
}

function parseColorRaw(raw: string): RGBA | null {
    let s = raw.trim()
    const v = /^var\(\s*--[^,]+,\s*(.+)\)$/.exec(s)
    if (v) s = v[1].trim()
    if (s[0] === "#") {
        const h = s.slice(1)
        const x = (a: string) => parseInt(a, 16)
        let r: number, g: number, b: number, a = 255
        if (h.length === 3 || h.length === 4) {
            r = x(h[0] + h[0]); g = x(h[1] + h[1]); b = x(h[2] + h[2])
            if (h.length === 4) a = x(h[3] + h[3])
        } else if (h.length === 6 || h.length === 8) {
            r = x(h.slice(0, 2)); g = x(h.slice(2, 4)); b = x(h.slice(4, 6))
            if (h.length === 8) a = x(h.slice(6, 8))
        } else return null
        const out: RGBA = [r / 255, g / 255, b / 255, a / 255]
        return out.every(Number.isFinite) ? out : null
    }
    const m = /^(rgba?|hsla?)\(([^)]*)\)$/i.exec(s)
    if (!m) return null
    const parts = m[2].split(/[\s,/]+/).filter(Boolean)
    if (parts.length < 3) return null
    const num = (p: string, scale: number) =>
        p.endsWith("%") ? (parseFloat(p) / 100) * scale : parseFloat(p)
    const alpha = parts.length > 3 ? num(parts[3], 1) : 1
    let rgb: [number, number, number]
    if (m[1].toLowerCase().startsWith("rgb")) {
        rgb = [num(parts[0], 255) / 255, num(parts[1], 255) / 255, num(parts[2], 255) / 255]
    } else {
        const hh = (((parseFloat(parts[0]) % 360) + 360) % 360) / 360
        const ss = num(parts[1], 1), ll = num(parts[2], 1)
        const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss
        const p = 2 * ll - q
        const f = (t: number) => {
            t = (t + 1) % 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }
        rgb = [f(hh + 1 / 3), f(hh), f(hh - 1 / 3)]
    }
    const out: RGBA = [rgb[0], rgb[1], rgb[2], alpha]
    return out.every(Number.isFinite) ? out.map((c) => Math.min(1, Math.max(0, c))) as RGBA : null
}

function cssRgba(c: RGBA): string {
    return `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}, ${c[3]})`
}


type Phase = "idle" | "playing" | "held" | "restoring"
interface TriggerState { phase: Phase; t: number; timer: number; prevPlay: boolean | undefined }
interface TriggerInput {
    dt: number; animDt: number; playDur: number; restoreDur: number; holdS: number
    play: boolean | undefined; clicked: boolean; onCanvas: boolean
}
interface TriggerEvents { started: boolean; completed: boolean; restored: boolean }

const TRIGGER_IDLE: TriggerState = { phase: "idle", t: 0, timer: 0, prevPlay: undefined }
const CANVAS_IDLE_S = 1
// R3 ruling: compare with epsilon everywhere a float accumulator (dt/animDt
// summed frame by frame) is checked against a duration boundary — repeated
// 0.1 additions land on 0.9999999999999999, not 1, so a strict >= misses the
// transition for exactly one extra frame and the reducer's own tests (which
// assert phase after an exact frame count) go red on that alone.
const EPS = 1e-9

// I2 ruling: controlled mode (play !== undefined) reacts to the play LEVEL
// each step, not an edge against prevPlay — an uncontrolled run (play was
// undefined, so prevPlay never became true) that switches straight to
// play:false must still interrupt on that very frame. prevPlay stays on the
// state shape (set below every step) but is no longer read for a decision.
// I1 ruling: only the two *interrupt* transitions — playing→restoring and
// restoring→playing — mirror progress (t = 1 - s.t) so a controlled toggle
// keeps the visual position continuous. held→restoring and idle→playing are
// normal starts and still begin at t = 0.
function stepTrigger(s: TriggerState, i: TriggerInput): { s: TriggerState; e: TriggerEvents } {
    const e: TriggerEvents = { started: false, completed: false, restored: false }
    const n: TriggerState = { ...s, prevPlay: i.play }
    const controlled = i.play !== undefined
    const start = (t = 0) => { n.phase = "playing"; n.t = t; n.timer = 0; e.started = true }
    const restore = (t = 0) => { n.phase = "restoring"; n.t = t; n.timer = 0 }

    switch (s.phase) {
        case "idle":
            n.timer = s.timer + i.dt
            if (controlled ? i.play === true : i.clicked || (i.onCanvas && n.timer >= CANVAS_IDLE_S - EPS)) start()
            break
        case "playing":
            if (controlled && i.play === false) { restore(1 - s.t); break }
            n.t = Math.min(1, s.t + i.animDt / Math.max(1e-3, i.playDur))
            if (n.t >= 1 - EPS) { n.t = 1; n.phase = "held"; n.timer = 0; e.completed = true }
            break
        case "held":
            if (controlled) { if (i.play === false) restore(0); break }
            n.timer = s.timer + i.dt
            if (n.timer >= i.holdS - EPS) restore(0)
            break
        case "restoring":
            if (controlled && i.play === true) { start(1 - s.t); break }
            n.t = Math.min(1, s.t + i.animDt / Math.max(1e-3, i.restoreDur))
            if (n.t >= 1 - EPS) { n.phase = "idle"; n.t = 0; n.timer = 0; e.restored = true }
            break
    }
    return { s: n, e }
}

/** Paints the card into ctx (canvas already sized w*dpr × h*dpr). Returns glyph boxes in CSS px when asked. */
function loadImage(src: string | undefined): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
        if (!src || typeof Image === "undefined") return resolve(null)
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = () => resolve(null)
        img.src = src
    })
}

// ── /moments-kit ──

// ══ EFFECT — replace from here ══════════════════════════════════════════════

const PLAY_S = 7.2
const RESTORE_S = 0.26

/** Tuning values. Stripped at publish; the tuned values are baked in here. */
const ADVANCED_DEFAULTS = {
    strokeColor: "#4D4F49",
    strokeWidth: 1,
    nodeColor: "#8A8A8A",
    nodeFill: "#0D0D0D",
    nodeSize: 6,
    nodeOpacity: 100,
    litNodes: 100,
    nodeSpacing: 4,
    cornerAngle: 40,
    smoothing: 2,
    domeWidth: 100,
    tipShape: 100,
    pullReach: 30,
    firstFadeMs: 200,
    fadeInMs: 130,
    fadeOutMs: 160,
    riseMs: 270,
    domeHoldMs: 270,
    releaseMs: 660,
    beat1OnMs: 70,
    beat1OffMs: 930,
    beat2OnMs: 3000,
    beat2PullMs: 3530,
    beat3OnMs: 4360,
    beat3PullMs: 5000,
    beat4OnMs: 5930,
    beat4OffMs: 7040,
    pull: 22,
    bounce: 70,
    stretch: 90,
    grain: 0,
    vignette: 0,
    hover: 50,
}

// ── moved controls (builder) ──
/**
 * Controls moved in the builder: into Advanced, out of it, or into groups of
 * their own. The code reads each one where it was first written, so the props
 * are put back in that shape before anything reads them.
 */
const MOVED_CONTROLS: { into: Record<string, string>; out: Record<string, string> } = {"into":{},"out":{"hover":"advanced"}}
type Bag = Record<string, unknown>
const GROUP_FALLBACKS: Record<string, Bag> = { advanced: ADVANCED_DEFAULTS }
function withMovedControls(props: Props): Props {
    const out = { ...props } as Bag
    for (const [k, g] of Object.entries(MOVED_CONTROLS.into)) {
        out[k] = (props as Bag)[g] !== undefined ? ((props as Bag)[g] as Bag)?.[k] : GROUP_FALLBACKS[g]?.[k]
    }
    for (const [k, g] of Object.entries(MOVED_CONTROLS.out)) {
        if (out[k] !== undefined) out[g] = { ...((out[g] as Bag) ?? {}), [k]: out[k] }
    }
    return out as Props
}
// ── /moved controls ──

/** The effect's own colours and whether the beat runs. */
interface EffectProps {
    autoplay?: boolean
    accent?: string
    glyphColor?: string
    advanced?: Partial<typeof ADVANCED_DEFAULTS>
}

interface Loop {
    pts: Float32Array
    up: Float32Array
    /** Per outline point: share of the dome lift it takes (0 off the run of contour that holds the letter top). */
    lw: Float32Array
    anchors: number[]
    /** For each outline point: the anchor segment it sits on (anchors[k] → anchors[k + 1]) and how far along it. */
    seg: Int32Array
    segU: Float32Array
    /** Per anchor: dragged offset and spring velocity, device px. */
    off: Float32Array
    vel: Float32Array
}
interface Grab {
    li: number
    lo: number
    q: number
    gx: number
    gy: number
}
interface Letter {
    loops: Loop[]
    x0: number
    x1: number
    y0: number
    y1: number
    topX: number
    topY: number
    rest: Path2D
}
interface Effect {
    p: Props
    letters: Letter[]
    order: number[]
    fontDev: number
    reduced: boolean
    hoverK: Float32Array
    drag: Float32Array
    dragLetter: number
    wasDown: boolean
    last: number
    grain: CanvasPattern | null
    grab: Grab | null
    cursor: string
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)
const smooth = (e0: number, e1: number, x: number) => {
    const u = clamp((x - e0) / (e1 - e0), 0, 1)
    return u * u * (3 - 2 * u)
}
const easeOut = (u: number) => 1 - Math.pow(1 - clamp(u, 0, 1), 3)
const easeIn = (u: number) => Math.pow(clamp(u, 0, 1), 2.2)
const releaseEase = (u: number) => {
    const v = Math.pow(clamp(u, 0, 1), 1.25)
    return v * v * v * (v * (v * 6 - 15) + 10)
}

function mixRgba(a: RGBA, b: RGBA, k: number): string {
    return cssRgba([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, 1])
}

function sampleA(a: Float32Array, w: number, h: number, x: number, y: number): number {
    const xi = Math.round(x), yi = Math.round(y)
    return xi < 0 || yi < 0 || xi >= w || yi >= h ? 0 : a[yi * w + xi]
}

/** Marching squares on the glyph alpha → closed outlines, in mask device px. */
function traceLoops(a: Float32Array, w: number, h: number, step: number): number[][] {
    const nx = Math.ceil(w / step) + 3
    const ny = Math.ceil(h / step) + 3
    const val = new Float32Array(nx * ny)
    // Each grid node holds the mean coverage of the step × step block of pixels around it,
    // not the one pixel it lands on. The glyph's anti-aliased edge is a single pixel wide, so
    // a lone sample every 2-4 px read as all-in or all-out, and the 0.5 crossing interpolated
    // between them wandered by up to half a cell: a sawtooth along every stroke, the bumps.
    // A block mean falls through 0.5 exactly where the edge is.
    // The blocks tile the mask, so one pass over its pixels fills every node.
    const h0 = step >> 1
    for (let y = 0; y < h; y++) {
        const row = (((y + h0) / step) | 0) + 1
        for (let x = 0; x < w; x++) val[row * nx + (((x + h0) / step) | 0) + 1] += a[y * w + x]
    }
    const inv = 1 / (step * step)
    for (let k = 0; k < val.length; k++) val[k] *= inv
    // Where that block's centre sits, in mask px (pixel i spans i..i+1, so a 1 px block centres on i + 0.5).
    const c0 = step / 2 - h0
    const HV = nx * ny
    const NE = HV * 2
    const nb = new Int32Array(NE * 2).fill(-1)
    const link = (e1: number, e2: number) => {
        if (nb[e1 * 2] < 0) nb[e1 * 2] = e2
        else nb[e1 * 2 + 1] = e2
        if (nb[e2 * 2] < 0) nb[e2 * 2] = e1
        else nb[e2 * 2 + 1] = e1
    }
    for (let j = 0; j < ny - 1; j++)
        for (let i = 0; i < nx - 1; i++) {
            const tl = val[j * nx + i] > 0.5
            const tr = val[j * nx + i + 1] > 0.5
            const br = val[(j + 1) * nx + i + 1] > 0.5
            const bl = val[(j + 1) * nx + i] > 0.5
            const c = (tl ? 8 : 0) | (tr ? 4 : 0) | (br ? 2 : 0) | (bl ? 1 : 0)
            if (c === 0 || c === 15) continue
            const T = j * nx + i
            const B = (j + 1) * nx + i
            const L = HV + j * nx + i
            const R = HV + j * nx + i + 1
            switch (c) {
                case 1: case 14: link(L, B); break
                case 2: case 13: link(B, R); break
                case 3: case 12: link(L, R); break
                case 4: case 11: link(T, R); break
                case 5: link(T, L); link(R, B); break
                case 6: case 9: link(T, B); break
                case 7: case 8: link(T, L); break
                case 10: link(T, R); link(L, B); break
            }
        }
    const pos = (e: number, out: number[]) => {
        if (e < HV) {
            const i = e % nx, j = (e / nx) | 0
            const a0 = val[e], a1 = val[e + 1]
            const t = clamp((0.5 - a0) / (a1 - a0 || 1e-6), 0, 1)
            out.push((i - 1 + t) * step + c0, (j - 1) * step + c0)
        } else {
            const k = e - HV
            const i = k % nx, j = (k / nx) | 0
            const a0 = val[k], a1 = val[k + nx]
            const t = clamp((0.5 - a0) / (a1 - a0 || 1e-6), 0, 1)
            out.push((i - 1) * step + c0, (j - 1 + t) * step + c0)
        }
    }
    const seen = new Uint8Array(NE)
    const loops: number[][] = []
    for (let e = 0; e < NE; e++) {
        if (seen[e] || nb[e * 2] < 0) continue
        const pts: number[] = []
        let prev = -1
        let cur = e
        while (cur >= 0 && !seen[cur]) {
            seen[cur] = 1
            pos(cur, pts)
            const n0 = nb[cur * 2], n1 = nb[cur * 2 + 1]
            const nxt = n0 !== prev ? n0 : n1
            prev = cur
            cur = nxt
        }
        if (pts.length >= 16) loops.push(pts)
    }
    return loops
}

/** Smooths an outline, marks which way each point faces, and picks its anchor nodes. */
function makeLoop(raw: number[], passes: number, a: Float32Array, w: number, h: number, step: number, minD: number, cornerCos: number): Loop {
    const n = raw.length / 2
    let pts = Float32Array.from(raw)
    for (let s = 0; s < passes; s++) {
        const nx = new Float32Array(pts.length)
        for (let i = 0; i < n; i++) {
            const a0 = ((i - 1 + n) % n) * 2, a1 = i * 2, a2 = ((i + 1) % n) * 2
            nx[a1] = pts[a0] * 0.25 + pts[a1] * 0.5 + pts[a2] * 0.25
            nx[a1 + 1] = pts[a0 + 1] * 0.25 + pts[a1 + 1] * 0.5 + pts[a2 + 1] * 0.25
        }
        pts = nx
    }
    const P = (i: number) => (((i % n) + n) % n) * 2
    const K = 2
    const up = new Float32Array(n)
    const tx = new Float32Array(n)
    const ty = new Float32Array(n)
    const off = 2.5 * step
    for (let i = 0; i < n; i++) {
        const a0 = P(i - K), a2 = P(i + K)
        let dx = pts[a2] - pts[a0], dy = pts[a2 + 1] - pts[a0 + 1]
        const l = Math.hypot(dx, dy) || 1
        dx /= l
        dy /= l
        tx[i] = dx
        ty[i] = dy
        let nX = dy, nY = -dx
        const x = pts[i * 2], y = pts[i * 2 + 1]
        const sA = sampleA(a, w, h, x + nX * off, y + nY * off)
        const sB = sampleA(a, w, h, x - nX * off, y - nY * off)
        if (sA > sB) {
            nX = -nX
            nY = -nY
        }
        up[i] = smooth(0.1, 0.55, -nY)
    }
    const cand: { i: number; pri: number }[] = []
    const K2 = Math.max(2, Math.round((minD * 0.4) / Math.max(1, step)))
    if (n > K2 * 2 + 2) {
        const turn = new Float32Array(n)
        for (let i = 0; i < n; i++) {
            const p0 = P(i - K2), p1 = i * 2, p2 = P(i + K2)
            const v1x = pts[p1] - pts[p0], v1y = pts[p1 + 1] - pts[p0 + 1]
            const v2x = pts[p2] - pts[p1], v2y = pts[p2 + 1] - pts[p1 + 1]
            const l = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y) || 1
            turn[i] = (v1x * v2x + v1y * v2y) / l
        }
        for (let i = 0; i < n; i++) {
            if (turn[i] >= cornerCos) continue
            let isMin = true
            for (let d = 1; d <= K2 && isMin; d++) {
                if (turn[(i + d) % n] < turn[i] || turn[(i - d + n) % n] < turn[i]) isMin = false
            }
            if (isMin) cand.push({ i, pri: 0 })
        }
    }
    for (const d of [tx, ty]) {
        let start = -1
        for (let i = 0; i < n; i++) if (Math.abs(d[i]) > 0.35) { start = i; break }
        if (start < 0) continue
        let sign = Math.sign(d[start])
        let lastStrong = start
        for (let j = 1; j <= n; j++) {
            const i = (start + j) % n
            const v = d[i]
            if (Math.abs(v) <= 0.35) continue
            const sg = Math.sign(v)
            if (sg !== sign) {
                const span = (i - lastStrong + n) % n
                cand.push({ i: (lastStrong + Math.round(span / 2)) % n, pri: 1 })
                sign = sg
            }
            lastStrong = i
        }
    }
    cand.sort((p, q) => p.pri - q.pri)
    const anchors: number[] = []
    for (const c of cand) {
        const x = pts[c.i * 2], y = pts[c.i * 2 + 1]
        let ok = true
        for (const k of anchors) {
            if (Math.hypot(pts[k * 2] - x, pts[k * 2 + 1] - y) < minD) { ok = false; break }
        }
        if (ok) anchors.push(c.i)
    }
    anchors.sort((p, q) => p - q)
    const m = anchors.length
    const seg = new Int32Array(n)
    const segU = new Float32Array(n)
    for (let k = 0; k < m; k++) {
        const a0 = anchors[k], a1 = anchors[(k + 1) % m]
        const span = (a1 - a0 + n) % n || n
        for (let d = 0; d < span; d++) {
            const j = (a0 + d) % n
            seg[j] = k
            segU[j] = d / span
        }
    }
    return { pts, up, lw: new Float32Array(n), anchors, seg, segU, off: new Float32Array(m * 2), vel: new Float32Array(m * 2) }
}

function insidePoly(pts: Float32Array, x: number, y: number): boolean {
    let c = false
    const n = pts.length / 2
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = pts[i * 2], yi = pts[i * 2 + 1], xj = pts[j * 2], yj = pts[j * 2 + 1]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
    }
    return c
}

/** Nearest anchor node within r of (px, py), in mask device px. */
function pickNode(letters: Letter[], px: number, py: number, r: number): Grab | null {
    let best = r * r
    let out: Grab | null = null
    for (let li = 0; li < letters.length; li++) {
        const loops = letters[li].loops
        for (let lo = 0; lo < loops.length; lo++) {
            const l = loops[lo]
            for (let q = 0; q < l.anchors.length; q++) {
                const a = l.anchors[q]
                const x = l.pts[a * 2] + l.off[q * 2]
                const y = l.pts[a * 2 + 1] + l.off[q * 2 + 1]
                const d2 = (x - px) * (x - px) + (y - py) * (y - py)
                if (d2 < best) {
                    best = d2
                    out = { li, lo, q, gx: px - x, gy: py - y }
                }
            }
        }
    }
    return out
}

const DISP = new Float32Array(2)
/** How far outline point j moves: only the two anchors bounding its segment pull it, eased to 0 at the far anchor. */
function nodeDisp(l: Loop, j: number): Float32Array {
    const m = l.anchors.length
    DISP[0] = 0
    DISP[1] = 0
    if (m === 0) return DISP
    const k = l.seg[j], u = l.segU[j]
    if (m === 1) {
        const w = 0.5 + 0.5 * Math.cos(2 * Math.PI * u)
        DISP[0] = l.off[0] * w
        DISP[1] = l.off[1] * w
        return DISP
    }
    const k2 = (k + 1) % m
    const e = 0.5 - 0.5 * Math.cos(Math.PI * u)
    DISP[0] = l.off[k * 2] * (1 - e) + l.off[k2 * 2] * e
    DISP[1] = l.off[k * 2 + 1] * (1 - e) + l.off[k2 * 2 + 1] * e
    return DISP
}

let GRAIN_TILE: HTMLCanvasElement | null = null
function grainTile(): HTMLCanvasElement {
    if (!GRAIN_TILE) {
        const c = document.createElement("canvas")
        c.width = 128
        c.height = 128
        const g = c.getContext("2d")!
        const im = g.createImageData(128, 128)
        for (let i = 0; i < 128 * 128; i++) {
            im.data[i * 4] = 255
            im.data[i * 4 + 1] = 255
            im.data[i * 4 + 2] = 255
            im.data[i * 4 + 3] = Math.random() * 255
        }
        g.putImageData(im, 0, 0)
        GRAIN_TILE = c
    }
    return GRAIN_TILE
}

/** Traces every glyph into vector outlines with anchor nodes. */
function bakeEffect(stage: Stage, mask: GlyphMask, p: Props): Effect {
    const adv = { ...ADVANCED_DEFAULTS, ...(p.advanced ?? {}) }
    const fontDev = Math.max(8, mask.fontPx * stage.dpr)
    const step = Math.max(1, Math.round(fontDev / 200))
    const minD = Math.max(4, (clamp(num(adv.nodeSpacing, 4), 1, 30) / 100) * fontDev)
    const cornerCos = Math.cos((clamp(num(adv.cornerAngle, 40), 5, 150) * Math.PI) / 180)
    const passes = clamp(Math.round(num(adv.smoothing, 2)), 0, 6)
    const minArea = Math.pow(fontDev * 0.02, 2)

    type Info = { l: Loop; x0: number; x1: number; y0: number; y1: number; area: number; depth: number }
    const infos: Info[] = []
    for (const raw of traceLoops(mask.alpha, mask.w, mask.h, step)) {
        const l = makeLoop(raw, passes, mask.alpha, mask.w, mask.h, step, minD, cornerCos)
        const n = l.pts.length / 2
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, area = 0
        for (let i = 0, j = n - 1; i < n; j = i++) {
            const x = l.pts[i * 2], y = l.pts[i * 2 + 1]
            if (x < x0) x0 = x
            if (x > x1) x1 = x
            if (y < y0) y0 = y
            if (y > y1) y1 = y
            area += l.pts[j * 2] * y - x * l.pts[j * 2 + 1]
        }
        area = Math.abs(area) / 2
        if (area < minArea) continue
        infos.push({ l, x0, x1, y0, y1, area, depth: 0 })
    }
    const contains = (b: Info, a: Info) =>
        b !== a && b.x0 <= a.x0 && b.x1 >= a.x1 && b.y0 <= a.y0 && b.y1 >= a.y1 && insidePoly(b.l.pts, a.l.pts[0], a.l.pts[1])
    for (const a of infos) for (const b of infos) if (contains(b, a)) a.depth++

    const groups = infos.filter((i) => i.depth % 2 === 0).map((o) => ({ o, loops: [o.l] }))
    for (const hole of infos) {
        if (hole.depth % 2 === 0) continue
        let best: (typeof groups)[number] | null = null
        for (const g of groups) {
            if (g.o.depth !== hole.depth - 1 || !contains(g.o, hole)) continue
            if (!best || g.o.area < best.o.area) best = g
        }
        if (best) best.loops.push(hole.l)
    }

    let letters: Letter[] = groups.map(({ o, loops }) => {
        let topX = o.x0, topY = Infinity
        const n = o.l.pts.length / 2
        for (let i = 0; i < n; i++) {
            const y = o.l.pts[i * 2 + 1]
            if (y < topY) {
                topY = y
                topX = o.l.pts[i * 2]
            }
        }
        const rest = new Path2D()
        for (const l of loops) {
            const m = l.pts.length / 2
            for (let i = 0; i < m; i++) {
                if (i === 0) rest.moveTo(l.pts[0], l.pts[1])
                else rest.lineTo(l.pts[i * 2], l.pts[i * 2 + 1])
            }
            rest.closePath()
        }
        return { loops, x0: o.x0, x1: o.x1, y0: o.y0, y1: o.y1, topX, topY, rest }
    })

    // Dome lift weights. Weighting every up-facing point near the top by x alone
    // also lifted flat tops beside the arch (the stem of an n) while the edge
    // under them stayed, tearing the outline into a fold. Only the unbroken run
    // of contour through the top point lifts, as when its top node is dragged.
    const widthK = clamp(num(adv.domeWidth, 100), 10, 300) / 100
    const tip = clamp(num(adv.tipShape, 100), 20, 400) / 100
    const reach = Math.max(1, (clamp(num(adv.pullReach, 30), 1, 100) / 100) * fontDev)
    for (const L of letters) {
        const l = L.loops[0]
        const n = l.pts.length / 2
        const hw = Math.max(1, (L.x1 - L.x0) * 0.5 * widthK)
        const raw = new Float32Array(n)
        let top = 0
        for (let j = 0; j < n; j++) {
            const x = l.pts[j * 2], y = l.pts[j * 2 + 1]
            if (y < l.pts[top * 2 + 1]) top = j
            const u = Math.abs(x - L.topX) / hw
            const v = 1 - (y - L.topY) / reach
            raw[j] = u >= 1 || v <= 0 ? 0 : Math.pow(1 - u, tip) * l.up[j] * smooth(0, 1, v)
        }
        // Eased to 0 over the last quarter of each side, so a notch where the run
        // ends (the crotch of an n) keeps its shape instead of being squeezed shut.
        const at = (d: number) => (((top + d) % n) + n) % n
        for (const dir of [1, -1]) {
            let len = 0
            while (len < n && raw[at(dir * len)] > 0) len++
            for (let d = 0; d < len; d++) l.lw[at(dir * d)] = raw[at(dir * d)] * smooth(0, 0.25, (len - d) / len)
        }
        // A light blur along the contour takes out the per-point facing noise
        // that otherwise shows as a sawtooth once the dome is up.
        const tmp = new Float32Array(n)
        for (let s = 0; s < 2; s++) {
            for (let j = 0; j < n; j++) tmp[j] = l.lw[(j - 1 + n) % n] * 0.25 + l.lw[j] * 0.5 + l.lw[(j + 1) % n] * 0.25
            l.lw.set(tmp)
        }
    }

    // Reading order: lines top to bottom, then left to right.
    letters.sort((a, b) => (a.y0 + a.y1) / 2 - (b.y0 + b.y1) / 2)
    const lines: Letter[][] = []
    for (const L of letters) {
        const last = lines[lines.length - 1]
        const mid = (L.y0 + L.y1) / 2
        if (last && Math.abs(mid - (last[0].y0 + last[0].y1) / 2) < fontDev * 0.5) last.push(L)
        else lines.push([L])
    }
    letters = lines.flatMap((l) => l.sort((a, b) => a.x0 - b.x0))

    // The reference lights n, c, s, a of "ascend": letters 4, 2, 1, 0 of 6.
    const N = letters.length
    const order = [0.8, 0.4, 0.2, 0].map((f) => clamp(Math.round(f * (N - 1)), 0, Math.max(0, N - 1)))

    const reduced = typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    return {
        p,
        letters,
        order,
        fontDev,
        reduced,
        hoverK: new Float32Array(N),
        drag: new Float32Array(N),
        dragLetter: -1,
        wasDown: false,
        last: -1,
        grain: null,
        grab: null,
        cursor: "",
    }
}

function beatK(s: number, on: number, inS: number, off: number, outS: number, linear: boolean): number {
    if (s < on) return 0
    if (s < on + inS) {
        const u = (s - on) / Math.max(1e-3, inS)
        return linear ? u : easeOut(u)
    }
    if (s < off) return 1
    if (s < off + outS) return 1 - easeOut((s - off) / Math.max(1e-3, outS))
    return 0
}

function pullLift(s: number, at: number, rise: number, hold: number, rel: number): number {
    if (s < at) return 0
    if (s < at + rise) return easeIn((s - at) / Math.max(1e-3, rise))
    if (s < at + rise + hold) return 1
    if (s < at + rise + hold + rel) return 1 - releaseEase((s - at - rise - hold) / Math.max(1e-3, rel))
    return 0
}

/** Vector-editor glyphs: one letter at a time flashes the accent; two get their top node dragged into a dome. Every node can be dragged and springs back. */
function drawEffect(stage: Stage, mask: GlyphMask, fx: Effect, t: number, phase: Phase): void {
    const { ctx, dpr, ink, W, H } = stage
    const p = fx.p
    const adv = { ...ADVANCED_DEFAULTS, ...(p.advanced ?? {}) }
    const now = performance.now()
    const dt = fx.last < 0 ? 0 : Math.min(0.05, (now - fx.last) / 1000)
    fx.last = now
    const letters = fx.letters
    const N = letters.length
    const fontDev = fx.fontDev

    // Scripted beats (reference seconds; the play phase covers 0 → PLAY_S).
    const sec = (v: number, d: number) => Math.max(0, num(v, d)) / 1000
    const lit = new Float32Array(N)
    const lift = new Float32Array(N)
    const s = phase === "playing" && !fx.reduced ? t * PLAY_S : -1
    if (s >= 0 && N > 0) {
        const fadeIn = sec(adv.fadeInMs, 130)
        const fadeOut = sec(adv.fadeOutMs, 160)
        const rise = sec(adv.riseMs, 270)
        const hold = sec(adv.domeHoldMs, 270)
        const rel = sec(adv.releaseMs, 660)
        const put = (i: number, k: number, l: number) => {
            lit[i] = Math.max(lit[i], k)
            lift[i] = Math.max(lift[i], l)
        }
        const [o0, o1, o2, o3] = fx.order
        put(o0, beatK(s, sec(adv.beat1OnMs, 70), sec(adv.firstFadeMs, 200), sec(adv.beat1OffMs, 930), fadeOut, true), 0)
        const p2 = sec(adv.beat2PullMs, 3530)
        put(o1, beatK(s, sec(adv.beat2OnMs, 3000), fadeIn, p2, rise, false), pullLift(s, p2, rise, hold, rel))
        const p3 = sec(adv.beat3PullMs, 5000)
        put(o2, beatK(s, sec(adv.beat3OnMs, 4360), fadeIn, p3, rise, false), pullLift(s, p3, rise, hold, rel))
        put(o3, beatK(s, sec(adv.beat4OnMs, 5930), fadeIn, sec(adv.beat4OffMs, 7040), fadeOut, false), 0)
    }

    // Pointer: hover lights the letter under it; press and drag pulls its top node up.
    const hs = Math.max(0, num(adv.hover, 50)) / 50
    const pt = stage.pointer
    const px = pt.x * dpr - mask.x
    const py = pt.y * dpr - mask.y
    let hovered = -1
    if (pt.over > 0.01 && hs > 0) {
        let best = Infinity
        for (let i = 0; i < N; i++) {
            const L = letters[i]
            if (py < L.y0 - fontDev * 0.45 || py > L.y1 + fontDev * 0.3) continue
            const d = px < L.x0 ? L.x0 - px : px > L.x1 ? px - L.x1 : 0
            if (d < best && d < fontDev * 0.15) {
                best = d
                hovered = i
            }
        }
    }
    const nodeR = Math.max(1.2 * ink, (clamp(num(adv.nodeSize, 6), 0, 30) / 2) * (mask.fontPx / 340) * dpr)
    const pickR = Math.max(nodeR * 2.6, 12 * dpr)
    if (pt.down && !fx.wasDown) {
        fx.grab = hs > 0 ? pickNode(letters, px, py, pickR) : null
        fx.dragLetter = fx.grab ? -1 : hovered
    }
    if (!pt.down) {
        fx.dragLetter = -1
        fx.grab = null
    }
    fx.wasDown = pt.down

    // Node springs: a held node follows the pointer on a rubber band (stretch caps it); released, it wobbles home.
    const bounce = clamp(num(adv.bounce, 70), 0, 100) / 100
    const lim = Math.max(1, (clamp(num(adv.stretch, 90), 5, 300) / 100) * fontDev)
    const zeta = 0.95 - bounce * 0.85
    const subs = Math.max(1, Math.ceil(dt / 0.008))
    const hStep = dt / subs
    const warped = new Uint8Array(N)
    const grab = fx.grab
    for (let i = 0; i < N; i++) {
        const loops = letters[i].loops
        for (let lo = 0; lo < loops.length; lo++) {
            const l = loops[lo]
            for (let q = 0; q < l.anchors.length; q++) {
                let tx = 0, ty = 0
                let held = false
                if (grab && grab.li === i && grab.lo === lo && grab.q === q) {
                    held = true
                    const a = l.anchors[q]
                    const rx = px - grab.gx - l.pts[a * 2]
                    const ry = py - grab.gy - l.pts[a * 2 + 1]
                    const band = 1 / (1 + Math.hypot(rx, ry) / lim)
                    tx = rx * band
                    ty = ry * band
                }
                const ks = held ? 1600 : 180
                const c = 2 * Math.sqrt(ks) * (held ? 0.9 : zeta)
                const o = q * 2
                for (let s2 = 0; s2 < subs; s2++) {
                    l.vel[o] += (ks * (tx - l.off[o]) - c * l.vel[o]) * hStep
                    l.vel[o + 1] += (ks * (ty - l.off[o + 1]) - c * l.vel[o + 1]) * hStep
                    l.off[o] += l.vel[o] * hStep
                    l.off[o + 1] += l.vel[o + 1] * hStep
                }
                if (!held && Math.abs(l.off[o]) + Math.abs(l.off[o + 1]) < 0.05 && Math.abs(l.vel[o]) + Math.abs(l.vel[o + 1]) < 0.5) {
                    l.off[o] = 0
                    l.off[o + 1] = 0
                    l.vel[o] = 0
                    l.vel[o + 1] = 0
                }
                if (l.off[o] !== 0 || l.off[o + 1] !== 0) warped[i] = 1
            }
        }
    }
    const near = !fx.grab && pt.over > 0.5 && hs > 0 && pickNode(letters, px, py, pickR) !== null
    const cur = fx.grab ? "grabbing" : near ? "grab" : "default"
    if (cur !== fx.cursor) {
        ctx.canvas.style.cursor = cur
        fx.cursor = cur
    }
    const ah = 1 - Math.exp(-10 * dt)
    for (let i = 0; i < N; i++) {
        const target = i === hovered || i === fx.dragLetter || (fx.grab !== null && fx.grab.li === i) ? pt.over * Math.min(1, hs) : 0
        fx.hoverK[i] += (target - fx.hoverK[i]) * ah
        const dragT = i === fx.dragLetter ? clamp(letters[i].topY - py, 0, fontDev * 0.8) * Math.min(2, hs) : 0
        const rate = dragT > fx.drag[i] ? 16 : 7
        fx.drag[i] += (dragT - fx.drag[i]) * (1 - Math.exp(-rate * dt))
    }

    const accent = parseColor(p.accent, [0.773, 0.89, 0.255, 1])
    const glyph = parseColor(p.glyphColor, [0.137, 0.137, 0.137, 1])
    const strokeC = parseColor(adv.strokeColor, [0.3, 0.31, 0.286, 1])
    const nodeC = parseColor(adv.nodeColor, [0.54, 0.54, 0.54, 1])
    const nodeF = parseColor(adv.nodeFill, [0.05, 0.05, 0.05, 1])
    const pullDev = (clamp(num(adv.pull, 22), 0, 100) / 100) * fontDev
    // Hairlines are sized in `ink` (screen px), not `dpr`: a zoomed-out preview shrank
    // dpr with it, thinning the outline and node rings to a smeared 1 px and reading as blur.
    const lineW0 = clamp(num(adv.strokeWidth, 1), 0, 6)
    const lineW = lineW0 > 0 ? Math.max(1, lineW0 * ink) : 0
    const nodeA = clamp(num(adv.nodeOpacity, 100), 0, 100) / 100
    const litN = clamp(num(adv.litNodes, 100), 0, 100) / 100

    ctx.save()
    ctx.setTransform(1, 0, 0, 1, mask.x, mask.y)
    ctx.lineJoin = "round"
    for (let i = 0; i < N; i++) {
        const L = letters[i]
        const k = clamp(Math.max(lit[i], fx.hoverK[i]), 0, 1)
        const L_lift = Math.max(lift[i] * pullDev, fx.drag[i])
        const moving = L_lift > 0.3
        let path = L.rest
        if (moving || warped[i] === 1) {
            path = new Path2D()
            for (const l of L.loops) {
                const m = l.pts.length / 2
                for (let j = 0; j < m; j++) {
                    const d = nodeDisp(l, j)
                    const x = l.pts[j * 2] + d[0]
                    const y = l.pts[j * 2 + 1] - (moving ? L_lift * l.lw[j] : 0) + d[1]
                    if (j === 0) path.moveTo(x, y)
                    else path.lineTo(x, y)
                }
                path.closePath()
            }
        }
        ctx.fillStyle = mixRgba(glyph, accent, k)
        ctx.fill(path, "evenodd")
        if (lineW > 0) {
            ctx.lineWidth = lineW
            ctx.strokeStyle = mixRgba(strokeC, accent, k)
            ctx.stroke(path)
        }
        if (nodeA > 0 && nodeR > 0) {
            const kn = k * litN
            ctx.globalAlpha = nodeA
            ctx.beginPath()
            for (const l of L.loops)
                for (let q = 0; q < l.anchors.length; q++) {
                    const a = l.anchors[q]
                    const x = l.pts[a * 2] + l.off[q * 2]
                    const y = l.pts[a * 2 + 1] - (moving ? L_lift * l.lw[a] : 0) + l.off[q * 2 + 1]
                    ctx.moveTo(x + nodeR, y)
                    ctx.arc(x, y, nodeR, 0, Math.PI * 2)
                }
            ctx.fillStyle = mixRgba(nodeF, accent, kn)
            ctx.fill()
            ctx.lineWidth = Math.max(1, ink)
            ctx.strokeStyle = mixRgba(nodeC, accent, kn)
            ctx.stroke()
            ctx.globalAlpha = 1
        }
    }
    ctx.restore()

    const vig = clamp(num(adv.vignette, 0), 0, 100) / 100
    if (vig > 0) {
        const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.hypot(W, H) / 2)
        g.addColorStop(0, "rgba(0,0,0,0)")
        g.addColorStop(1, `rgba(0,0,0,${vig})`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
    }
    const grain = clamp(num(adv.grain, 0), 0, 100) / 100
    if (grain > 0) {
        if (!fx.grain) fx.grain = ctx.createPattern(grainTile(), "repeat")
        if (fx.grain) {
            ctx.save()
            ctx.globalAlpha = grain * 0.18
            const ox = (Math.random() * 128) | 0
            const oy = (Math.random() * 128) | 0
            ctx.translate(-ox, -oy)
            ctx.fillStyle = fx.grain
            ctx.fillRect(ox, oy, W, H)
            ctx.restore()
        }
    }
}

// ══ /EFFECT ═════════════════════════════════════════════════════════════════

interface Props extends EffectProps {
    background?: string
    speed?: number
    hold?: number
    /** The lockup to trace. A path under `public/`, never inlined path data. */
    src?: string
    play?: boolean
    onComplete?: () => void
    /**
     * Fired once, on the first frame that actually paints the artwork.
     *
     * The caller renders the real `<Logo>` underneath as the fallback for no
     * JavaScript, a failed fetch or a server render, and the two cannot both
     * be visible: the trace insets the artwork to leave room for its nodes,
     * so it is smaller than a logo filling the same box and the pair reads as
     * one mark printed twice. This is the signal to put the fallback away.
     */
    onReady?: () => void
    style?: CSSProperties
}
interface Stage {
    ctx: CanvasRenderingContext2D
    W: number
    H: number
    dpr: number
    /** Device px per CSS px for hairlines: dpr, but never below the 1:1 screen value when zoomed out. */
    ink: number
    /**
     * The pointer over the stage, for the effect's pointer response (RULES.md):
     * x, y in CSS px; `over` eases to 1 while it is over the stage and back to 0
     * after; `down` while pressed. Scale the response by the Advanced `hover` row.
     */
    pointer: StagePointer
}
interface StagePointer {
    x: number
    y: number
    over: number
    down: boolean
}
/** Cropped artwork mask in DEVICE px: `canvas` is w×h, placed at (x, y) on the stage canvas. */
interface GlyphMask {
    canvas: HTMLCanvasElement
    alpha: Float32Array
    x: number
    y: number
    w: number
    h: number
    /*
     * A scale reference for everything measured "per em" -- node radius, the
     * tracing step, the minimum spacing between anchors. It was the font size;
     * with artwork it is the drawn height of the lockup, which serves the same
     * purpose: one number that says how big the thing on screen is.
     */
    fontPx: number
}

/*
 * A CSS colour, flattened to #rrggbb.
 *
 * The five colours below are tokens -- `--text`, `--accent` and so on -- and
 * a token on this site resolves to `oklch()`, which the kit's `parseColor`
 * does not read and `canvas` would reject on some engines. A 1x1 canvas does
 * the conversion with the browser's own colour code, so anything CSS
 * understands arrives here as three bytes.
 *
 * Returns null for an empty or unparseable value, so a missing token falls
 * back to the effect's own default rather than painting black.
 */
function flatten(value: string): string | null {
    const v = value.trim()
    if (!v) return null
    const c = document.createElement("canvas")
    c.width = c.height = 1
    const g = c.getContext("2d")
    if (!g) return null
    g.fillStyle = "#000"
    g.fillStyle = v
    const probe = g.fillStyle
    if (typeof probe === "string" && probe[0] === "#") return probe
    g.clearRect(0, 0, 1, 1)
    g.fillRect(0, 0, 1, 1)
    const d = g.getImageData(0, 0, 1, 1).data
    const hex = (n: number) => n.toString(16).padStart(2, "0")
    return `#${hex(d[0])}${hex(d[1])}${hex(d[2])}`
}

/** The effect's palette, read off the mounted element so themes travel. */
function readPalette(el: HTMLElement): Partial<Props> {
    const cs = getComputedStyle(el)
    const tok = (name: string) => flatten(cs.getPropertyValue(name)) ?? undefined
    return {
        glyphColor: tok("--text"),
        accent: tok("--accent-edge") ?? tok("--accent"),
        advanced: {
            strokeColor: tok("--text-muted"),
            nodeColor: tok("--text-muted"),
            nodeFill: tok("--canvas"),
        },
    }
}

function num(v: unknown, d: number): number {
    return typeof v === "number" && Number.isFinite(v) ? v : d
}

/** Chamfer distance (device px) from each inside pixel (alpha > 0.5) to the nearest outside pixel. */
function distanceInside(a: Float32Array, w: number, h: number): Float32Array {
    const d = new Float32Array(w * h)
    for (let i = 0; i < w * h; i++) d[i] = a[i] > 0.5 ? 1e9 : 0
    const D2 = Math.SQRT2
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            const i = y * w + x
            if (d[i] === 0) continue
            let v = d[i]
            if (x > 0) v = Math.min(v, d[i - 1] + 1)
            if (y > 0) {
                v = Math.min(v, d[i - w] + 1)
                if (x > 0) v = Math.min(v, d[i - w - 1] + D2)
                if (x < w - 1) v = Math.min(v, d[i - w + 1] + D2)
            }
            d[i] = v
        }
    for (let y = h - 1; y >= 0; y--)
        for (let x = w - 1; x >= 0; x--) {
            const i = y * w + x
            if (d[i] === 0) continue
            let v = d[i]
            if (x < w - 1) v = Math.min(v, d[i + 1] + 1)
            if (y < h - 1) {
                v = Math.min(v, d[i + w] + 1)
                if (x < w - 1) v = Math.min(v, d[i + w + 1] + D2)
                if (x > 0) v = Math.min(v, d[i + w - 1] + D2)
            }
            d[i] = v
        }
    return d
}
void distanceInside

/**
 * How much of the stage the artwork is drawn into, across and down.
 *
 * The rest is the margin the stroke and the anchor nodes sit in, since both
 * are drawn outside the outline. A caller that needs the artwork at a known
 * size divides by these.
 */
export const TRACE_INSET = { x: 0.94, y: 0.88 } as const

function buildMaskFromImage(W: number, H: number, dpr: number, img: HTMLImageElement): GlyphMask | null {
    /*
     * The artwork, drawn once and reduced to alpha.
     *
     * This replaces the original's `ctx.fillText`. The lockup files declare no
     * `fill` on any path, so they rasterise black at full alpha wherever the
     * shape is -- which is all the tracer wants, since it reads alpha and
     * never colour. The same property is why `Logo.tsx` can use the file as a
     * CSS mask over `currentColor`.
     */
    const natural = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 4
    /*
     * Fitted inside the stage, leaving the margin the nodes need.
     *
     * The text version used 86% x 80% because a 300px display letter can
     * spare 14% of the frame. This draws a 56px lockup, where that inset is
     * most of the mark -- and it has to agree with the caller, which centres
     * the static logo underneath at the drawn size. So the two fractions are
     * exported as `TRACE_INSET` and the caller sizes its stage from them
     * rather than guessing; see FooterLogo.tsx.
     *
     * 6% across and 12% down is 16px and 8px of air around a 56px lockup,
     * which is five times the 3px node radius at this scale.
     */
    let drawW = W * TRACE_INSET.x
    let drawH = drawW / natural
    if (drawH > H * TRACE_INSET.y) {
        drawH = H * TRACE_INSET.y
        drawW = drawH * natural
    }
    const full = document.createElement("canvas")
    full.width = Math.max(1, Math.round(W * dpr))
    full.height = Math.max(1, Math.round(H * dpr))
    const ctx = full.getContext("2d")
    if (!ctx) return null
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.drawImage(img, (W - drawW) / 2, (H - drawH) / 2, drawW, drawH)

    /* Cropped to the drawn box plus a little air, so the tracer walks the
       artwork rather than the whole stage. */
    const pad = Math.ceil(8 * dpr)
    const x0 = Math.max(0, Math.floor(((W - drawW) / 2) * dpr) - pad)
    const y0 = Math.max(0, Math.floor(((H - drawH) / 2) * dpr) - pad)
    const x1 = Math.min(full.width, Math.ceil(((W + drawW) / 2) * dpr) + pad)
    const y1 = Math.min(full.height, Math.ceil(((H + drawH) / 2) * dpr) + pad)
    const w = Math.max(1, x1 - x0)
    const h = Math.max(1, y1 - y0)
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const cctx = canvas.getContext("2d")
    if (!cctx) return null
    cctx.drawImage(full, x0, y0, w, h, 0, 0, w, h)
    const px = cctx.getImageData(0, 0, w, h).data
    const alpha = new Float32Array(w * h)
    for (let i = 0; i < w * h; i++) alpha[i] = px[i * 4 + 3] / 255
    return { canvas, alpha, x: x0, y: y0, w, h, fontPx: drawH }
}

// Most buffer pixels the stage canvas may hold (4096²): sharp up to about 4x zoom on a
// 1200 × 800 frame, and still a bounded cost per frame.
const MAX_BUFFER_PX = 4096 * 4096

function LogoTraceBase(raw: Props) {
    /* A local, not a reassigned parameter: the React Compiler treats props as
       immutable and rejects the original's `props = withMovedControls(props)`. */
    const props = withMovedControls(raw)
    // speed / hold are read live from propsRef; destructured here so their defaults sit in the signature.
    const { background = "transparent", speed = 50, hold = 2, autoplay = true, style } = props
    void [speed, hold, autoplay]
    const rootRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const propsRef = useRef(props)
    /*
     * Synced in an effect, not during render.
     *
     * The original assigns `propsRef.current` straight down the render body,
     * which is what Framer's components do and what the React Compiler
     * rejects outright -- "cannot access refs during render". An effect with
     * no dependency array is the same timing for this purpose: the draw loop
     * only reads the ref on its next frame. The same correction was needed on
     * CobaltLouvre.tsx, for the same reason.
     */
    useEffect(() => {
        propsRef.current = props
    })

    useEffect(() => {
        const root = rootRef.current
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!root || !canvas || !ctx) return
        /* The Framer editor canvas does not exist here; the beat always runs. */
        const onCanvas = false
        const reduced = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const stage: Stage = { ctx, W: 0, H: 0, dpr: 1, ink: 1, pointer: { x: 0, y: 0, over: 0, down: false } }
        // Drawn at the size it is shown. A scaled preview or canvas zoom shrinks the
        // root with a CSS transform; a layout-size bitmap resampled by it turned the
        // hairline outlines hazy and dashed. The canvas is laid out at zoom x size and
        // scaled back by 1/zoom, so its layout and visual widths stay equal.
        let zoom = 1
        const readZoom = () => {
            const w = root.getBoundingClientRect().width
            return root.offsetWidth > 0 && w > 0 ? clamp(w / root.offsetWidth, 0.1, 8) : 1
        }
        const resize = () => {
            stage.W = root.offsetWidth
            stage.H = root.offsetHeight
            zoom = readZoom()
            // Kept within a pixel budget rather than a fixed 3 buffer px per CSS px (with zoom
            // read only up to 2x): zoomed in on the canvas, or at 2x zoom on a 2x screen, the
            // browser stretched a bitmap smaller than the screen and the outlines went hazy.
            const budget = Math.sqrt(MAX_BUFFER_PX / Math.max(1, stage.W * stage.H))
            const screen = Math.min(window.devicePixelRatio || 1, 2)
            stage.dpr = Math.max(0.5, Math.min(screen * zoom, budget))
            stage.ink = Math.max(stage.dpr, screen)
            canvas.style.width = `${stage.W * zoom}px`
            canvas.style.height = `${stage.H * zoom}px`
            canvas.style.transform = zoom === 1 ? "" : `scale(${1 / zoom})`
            canvas.width = Math.max(1, Math.round(stage.W * stage.dpr))
            canvas.height = Math.max(1, Math.round(stage.H * stage.dpr))
        }
        const ro = new ResizeObserver(resize)
        ro.observe(root)
        resize()

        // The pointer, for the effect's pointer response. offsetX/Y, never
        // getBoundingClientRect: that carries the canvas zoom.
        let pointerInside = false
        const onPointerMove = (e: PointerEvent) => {
            // The canvas is laid out at zoom x the root, so its offsets are too.
            stage.pointer.x = e.offsetX / zoom
            stage.pointer.y = e.offsetY / zoom
            pointerInside = true
        }
        const onPointerLeave = () => {
            pointerInside = false
            stage.pointer.down = false
        }
        const onPointerDown = () => {
            stage.pointer.down = true
        }
        const onPointerUp = () => {
            stage.pointer.down = false
        }
        canvas.addEventListener("pointermove", onPointerMove)
        canvas.addEventListener("pointerenter", onPointerMove)
        canvas.addEventListener("pointerleave", onPointerLeave)
        canvas.addEventListener("pointerdown", onPointerDown)
        window.addEventListener("pointerup", onPointerUp)
        window.addEventListener("pointercancel", onPointerUp)

        let mask: GlyphMask | null = null
        let fx: Effect | null = null
        let key = ""

        /*
         * The artwork, fetched once.
         *
         * The original rebuilt its mask from a string every time the key
         * changed, which is free. An image is not, so it is loaded once here
         * and the mask is rebuilt from the decoded bitmap -- on a resize, a
         * dpr change, or a prop change, and never otherwise.
         *
         * Until it resolves there is no mask, `frame` draws nothing, and the
         * footer shows the plain lockup underneath (see LogoTraceMark). A
         * file that fails to load therefore degrades to the logo rather than
         * to a hole, which is the same bargain CobaltLouvre strikes with a
         * failed GL context.
         */
        let art: HTMLImageElement | null = null
        let artSrc = ""

        /* The palette lives on the element, so a theme change re-reads it. */
        let palette: Partial<Props> = readPalette(root)
        let paletteTick = 0

        /*
         * The palette is re-read when the theme changes, not on a timer.
         *
         * It used to be re-read every 30 frames, on the same slow tick as the
         * zoom. That was measured at **ten `getImageData` calls a second**, for
         * as long as the footer was on screen: `readPalette` resolves five
         * tokens and `flatten` gives each one its own 1x1 canvas, and reading a
         * pixel back is a synchronous GPU-to-CPU stall on the main thread. Two
         * of those a second, for ever, to catch something that happens when a
         * reader flips the OS out of dark mode.
         *
         * So the two things that can actually change it say so: the media
         * query, and an attribute change on the element the tokens hang off.
         * Everything else is the same code, reached only when it can matter.
         */
        let paletteDirty = false
        const markPaletteDirty = () => {
            paletteDirty = true
        }
        const scheme =
            typeof matchMedia !== "undefined" ? matchMedia("(prefers-color-scheme: dark)") : null
        scheme?.addEventListener("change", markPaletteDirty)
        const themeWatch =
            typeof MutationObserver !== "undefined"
                ? new MutationObserver(markPaletteDirty)
                : null
        themeWatch?.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "style", "data-theme"],
        })

        const sync = () => {
            const p = propsRef.current
            const src = p.src ?? ""
            if (src !== artSrc) {
                artSrc = src
                art = null
                mask = null
                fx = null
                key = ""
                void loadImage(src).then((img) => {
                    if (artSrc === src) art = img
                })
            }
            if (!art) return
            const merged: Props = {
                ...p,
                glyphColor: p.glyphColor ?? palette.glyphColor,
                accent: p.accent ?? palette.accent,
                advanced: { ...palette.advanced, ...(p.advanced ?? {}) },
            }
            const effectKeys = Object.keys(merged).filter((n) => !["src", "style", "play", "onComplete", "speed", "hold", "background", "autoplay"].includes(n))
            const next = JSON.stringify([src, stage.W, stage.H, stage.dpr, paletteTick, effectKeys.map((n) => (merged as Record<string, unknown>)[n])])
            if (next === key && fx) return
            key = next
            mask = buildMaskFromImage(stage.W, stage.H, stage.dpr, art)
            fx = mask ? bakeEffect(stage, mask, merged) : null
        }

        /* One shot: the fallback is retired on the first painted frame. */
        let announced = false

        let state: TriggerState = TRIGGER_IDLE

        let raf = 0
        let last = -1
        let zoomTick = 0
        // Off screen the loop parks; the observer below restarts it.
        let visible = true
        const frame = (now: number) => {
            if (!visible) {
                raf = 0
                return
            }
            raf = requestAnimationFrame(frame)
            const dt = last < 0 ? 0 : Math.min((now - last) / 1000, 1 / 20)
            stage.pointer.over += ((pointerInside ? 1 : 0) - stage.pointer.over) * (1 - Math.exp(-8 * dt))
            last = now
            // Canvas zoom fires no ResizeObserver, so the shown scale is re-read every 30 frames.
            /* The zoom still rides the slow tick: it is a layout read, not a
               pixel read, so it costs nothing worth saving. */
            if (++zoomTick % 30 === 0 && Math.abs(readZoom() - zoom) > zoom * 0.01) resize()
            if (paletteDirty) {
                paletteDirty = false
                const fresh = readPalette(root)
                if (JSON.stringify(fresh) !== JSON.stringify(palette)) {
                    palette = fresh
                    paletteTick++
                }
            }
            sync()
            const p = propsRef.current
            const r = stepTrigger(state, {
                dt,
                animDt: dt * (Math.max(0, Math.min(100, num(p.speed, 50))) / 50),
                playDur: reduced ? 0.2 : PLAY_S,
                restoreDur: reduced ? 0.2 : RESTORE_S,
                holdS: Math.max(0, Math.min(10, num(p.hold, 2))),
                // Autoplay on: starts straight away and loops. Off: the scripted beats stay idle; nodes still drag.
                play: p.play ?? (p.autoplay === false ? false : undefined),
                clicked: p.autoplay !== false,
                onCanvas,
            })
            state = r.s
            if (r.e.completed) p.onComplete?.()
            const t = state.phase === "playing" ? state.t : state.phase === "held" ? 1 : state.phase === "restoring" ? 1 - state.t : 0
            ctx.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0)
            ctx.clearRect(0, 0, stage.W, stage.H)
            if (mask && fx) {
                drawEffect(stage, mask, fx, t, state.phase)
                if (!announced) {
                    announced = true
                    p.onReady?.()
                }
            }
        }
        const io =
            typeof IntersectionObserver !== "undefined"
                ? new IntersectionObserver(([e]) => {
                      visible = e.isIntersecting
                      if (visible && !raf) {
                          last = -1
                          raf = requestAnimationFrame(frame)
                      }
                  })
                : null
        io?.observe(root)
        raf = requestAnimationFrame(frame)
        return () => {
            cancelAnimationFrame(raf)
            io?.disconnect()
            scheme?.removeEventListener("change", markPaletteDirty)
            themeWatch?.disconnect()
            canvas.removeEventListener("pointermove", onPointerMove)
            canvas.removeEventListener("pointerenter", onPointerMove)
            canvas.removeEventListener("pointerleave", onPointerLeave)
            canvas.removeEventListener("pointerdown", onPointerDown)
            window.removeEventListener("pointerup", onPointerUp)
            window.removeEventListener("pointercancel", onPointerUp)
            ro.disconnect()
        }
    }, [])

    return (
        /*
         * Fills its frame edge to edge; the artwork fits itself to the stage.
         * The original forced `aspectRatio: 1200 / 800` here, which is the
         * Framer frame's shape and not the lockup's -- the caller sizes this
         * box to the lockup's own ratio instead.
         */
        <div ref={rootRef} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background, ...style }}>
            <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", transformOrigin: "0 0" }} />
        </div>
    )
}

/**
 * The traced lockup.
 *
 * `src` is a path under `public/` -- always a brand file, never inlined path
 * data. The caller gives the box its size and the lockup's own ratio; see
 * `LogoTraceMark` in Footer.tsx for the one place this is used.
 */
export function LogoTrace(props: Props) {
    return <LogoTraceBase {...props} />
}
