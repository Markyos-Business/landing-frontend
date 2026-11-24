"use client";

/**
 * CobaltLouvre — a twisting ribbon of cobalt light behind fluted glass.
 *
 * Supplied by the owner as a Framer component and adapted here. The shader is
 * unchanged: a flat ribbon twisting on its vertical axis shows two silhouette
 * edges half a turn apart, x = ±R·cos(ωy + φ), and the pinches, lozenges and
 * vertical caustics are all the glow around those two curves, sliced by the
 * lens in front. There is no geometry — it is one screen-space fragment
 * shader on a single oversized triangle.
 *
 * ── Four things this adds to the original ─────────────────────────────────
 *
 * This site had deliberately avoided WebGL above the fold: `BRIEF.md` §7 asks
 * for Lighthouse ≥ 90 on mobile, and a GL context costs a shader compile, a
 * composite layer and a rAF loop before the headline paints. The owner asked
 * for it anyway, so the cost is paid down rather than argued with:
 *
 * 1. **It stops when it is off screen.** An IntersectionObserver cancels the
 *    loop entirely when the hero scrolls away — §7 asks for exactly this —
 *    so the rest of the page scrolls with no GPU work at all behind it.
 * 2. **devicePixelRatio is capped at 1.5**, not 2. §7 names that figure. On a
 *    3× phone it is the difference between 1× and 4× the fragments.
 * 3. **`prefers-reduced-motion` draws one frame and stops.** The composition
 *    is still there; nothing moves, and no rAF loop is ever scheduled.
 * 4. **A failed context is not a blank hero.** If WebGL is missing or the
 *    program will not link, the host keeps its background colour and the
 *    caller's fallback shows through, rather than leaving a black rectangle.
 */

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

/* -------------------------------------------------------------------------- */
/* defaults                                                                    */
/* -------------------------------------------------------------------------- */

const DEFAULT_GLASS = {
  slats: 10,
  magnify: 5,
  refraction: 5,
  groove: 4,
  edgeLight: 0,
};

const DEFAULT_LIGHT = {
  intensity: 1.3,
  center: 51,
  spread: 44,
};

export interface CobaltLouvreGlass {
  /** How many horizontal louvres divide the frame. */
  slats?: number;
  /** Vertical magnification per louvre — what slices the helix, 0-10. */
  magnify?: number;
  /** Sideways displacement each louvre applies to what is behind it, 0-10. */
  refraction?: number;
  /** Darkness of the thin separator between louvres, 0-10. */
  groove?: number;
  /** Lit rim on each louvre, 0-10. The reference frames have none. */
  edgeLight?: number;
}

export interface CobaltLouvreLight {
  /** Overall brightness of the glow, 0-10. */
  intensity?: number;
  /** Where the light peaks, as a percentage down the frame. */
  center?: number;
  /** How far it reaches before falling to black, as a percentage of height. */
  spread?: number;
}

export interface CobaltLouvreProps {
  /** The void behind everything. */
  background?: string;
  /** The colour the glow saturates from; the hot core always goes white. */
  glowColor?: string;
  /** How many ribbons stand side by side across the frame. */
  ribbons?: number;
  /** Full turns of the ribbon over the height of the frame. */
  twists?: number;
  /** Ribbon reach, as a percentage of a column half width. */
  ribbonWidth?: number;
  /** Layout axis for the louvres and the ribbon's twist. */
  orientation?: "horizontal" | "vertical";
  glass?: CobaltLouvreGlass;
  /** Rotation rate on an abstract 0-10 scale. */
  speed?: number;
  /** Which way the barber-pole streaming appears to run. */
  direction?: "down" | "up";
  light?: CobaltLouvreLight;
  /** Whether a soft highlight follows the pointer across the glass. */
  pointerReactive?: boolean;
  style?: CSSProperties;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* shaders                                                                     */
/* -------------------------------------------------------------------------- */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_phase;
uniform vec4  u_bg;
uniform vec3  u_glow;
uniform float u_ribbons;
uniform float u_twists;
uniform float u_width;
uniform float u_slats;
uniform float u_groove;
uniform float u_edge;
uniform float u_refract;
uniform float u_magnify;
uniform float u_intensity;
uniform float u_center;
uniform float u_spread;
uniform vec2  u_pointer;
uniform float u_pointerStrength;
uniform float u_orientation;

const float TAU = 6.28318530718;

const float EDGE_SOFTNESS = 0.26;
const float GROOVE_WIDTH = 0.045;
const float LENS_FOCUS = 0.5;
const float COLUMN_STAGGER = 1.7;

void main() {
    vec2 uv = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y) / u_res;
    vec2 gv = mix(uv, uv.yx, u_orientation);

    float s = gv.y * u_slats;
    float slatIndex = floor(s);
    float slatUV = fract(s) - 0.5;

    vec2 p = gv;
    p.x += slatUV * slatUV * sign(slatUV) * u_refract;

    float slatCentre = (slatIndex + 0.5) / u_slats;
    p.y = mix(gv.y, slatCentre, u_magnify);

    float px = clamp(p.x, 0.0, 0.999999);

    float col = floor(px * u_ribbons);
    float lx = (fract(px * u_ribbons) - 0.5) * 2.0;
    float phase = u_phase + col * COLUMN_STAGGER;

    float w = u_twists * TAU;
    float a = w * p.y + phase;
    float c = cos(a);
    float R = u_width;

    float d1 = lx - R * c;
    float d2 = lx + R * c;
    float t = EDGE_SOFTNESS;
    float density = exp(-d1 * d1 / (t * t)) + exp(-d2 * d2 / (t * t));

    float e = (uv.y - u_center) / u_spread;
    float env = exp(-e * e);

    vec2 pointerDelta = uv - u_pointer;
    pointerDelta.x *= u_res.x / u_res.y;
    float pointerDist2 = dot(pointerDelta, pointerDelta);
    float pointerGlow = exp(-pointerDist2 / 0.035) * u_pointerStrength;

    float lens = pow(max(cos(3.14159265 * slatUV), 0.0), LENS_FOCUS);

    float v = density * env * lens * u_intensity * (1.0 + pointerGlow * 2.2);

    vec3 lit = vec3(1.0) - exp(-u_glow * v);

    float rim = smoothstep(0.5 - GROOVE_WIDTH, 0.5, abs(slatUV));
    lit *= mix(1.0, 1.0 - rim, u_groove);
    lit += mix(u_glow, vec3(1.0), 0.5) * rim * u_edge * env;

    lit = clamp(lit, 0.0, 1.0);

    vec3 outRgb = vec3(1.0) - (vec3(1.0) - u_bg.rgb) * (vec3(1.0) - lit);
    float outA = max(u_bg.a, max(lit.r, max(lit.g, lit.b)));

    gl_FragColor = vec4(outRgb * outA, outA);
}
`;

/* -------------------------------------------------------------------------- */
/* helpers                                                                     */
/* -------------------------------------------------------------------------- */

type Rgba = [number, number, number, number];

/** Colours arrive as CSS strings; the shader wants 0-1 floats. */
function parseColor(input: string | undefined, fallback: Rgba): Rgba {
  if (!input) return fallback;
  const value = input.trim();

  const hex = /^#([0-9a-f]{3,8})$/i.exec(value);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) {
      h = h
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }
    if (h.length !== 6 && h.length !== 8) return fallback;
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
    return [n(0), n(2), n(4), h.length === 8 ? n(6) : 1];
  }

  const fn = /^rgba?\(([^)]+)\)$/i.exec(value);
  if (fn) {
    const parts = fn[1].split(/[,\s/]+/).filter(Boolean);
    if (parts.length < 3) return fallback;
    const chan = (raw: string) =>
      raw.indexOf("%") >= 0 ? parseFloat(raw) / 100 : parseFloat(raw) / 255;
    const rawAlpha = parts[3];
    const alpha =
      rawAlpha === undefined
        ? 1
        : rawAlpha.indexOf("%") >= 0
          ? parseFloat(rawAlpha) / 100
          : parseFloat(rawAlpha);
    return [chan(parts[0]), chan(parts[1]), chan(parts[2]), alpha];
  }

  return fallback;
}

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const UNIFORM_NAMES = [
  "u_res",
  "u_phase",
  "u_bg",
  "u_glow",
  "u_ribbons",
  "u_twists",
  "u_width",
  "u_slats",
  "u_groove",
  "u_edge",
  "u_refract",
  "u_magnify",
  "u_intensity",
  "u_center",
  "u_spread",
  "u_pointer",
  "u_pointerStrength",
  "u_orientation",
] as const;

type UniformName = (typeof UNIFORM_NAMES)[number];

/* -------------------------------------------------------------------------- */
/* component                                                                   */
/* -------------------------------------------------------------------------- */

export default function CobaltLouvre({
  background = "#0a0a0d",
  glowColor = "#0a3cff",
  ribbons = 1,
  twists = 4.4,
  ribbonWidth = 44,
  orientation = "horizontal",
  glass,
  speed = 3.3,
  direction = "down",
  light,
  pointerReactive = true,
  style,
  className,
}: CobaltLouvreProps) {
  const resolvedGlass = { ...DEFAULT_GLASS, ...glass };
  const resolvedLight = { ...DEFAULT_LIGHT, ...light };

  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const propsRef = useRef({
    background,
    glowColor,
    ribbons,
    twists,
    ribbonWidth,
    orientation,
    glass: resolvedGlass,
    light: resolvedLight,
    speed,
    direction,
    pointerReactive,
  });
  /*
   * Synced in an effect, not during render.
   *
   * The original assigned `propsRef.current` straight down the render body,
   * which is what Framer's own components do and what the React Compiler
   * rejects outright -- "cannot access refs during render". An effect with no
   * dependency array runs after every commit, which is the same timing for
   * this purpose: the render loop only reads the ref on its next frame.
   *
   * The point of the ref is unchanged -- the GL effect below depends on
   * nothing, so moving a slider updates what the loop reads without tearing
   * down the context and recompiling the program.
   */
  useEffect(() => {
    propsRef.current = {
      background,
      glowColor,
      ribbons,
      twists,
      ribbonWidth,
      orientation,
      glass: resolvedGlass,
      light: resolvedLight,
      speed,
      direction,
      pointerReactive,
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const gl = (canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    }) || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    // No GL: leave the host as it is, so whatever the caller painted behind
    // shows through instead of a black rectangle.
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One oversized triangle covers the viewport with no seam on the diagonal.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const attrib = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(attrib);
    gl.vertexAttribPointer(attrib, 2, gl.FLOAT, false, 0, 0);

    const u = {} as Record<UniformName, WebGLUniformLocation | null>;
    for (const name of UNIFORM_NAMES) {
      u[name] = gl.getUniformLocation(program, name);
    }

    let width = 0;
    let height = 0;
    const resize = () => {
      // 1.5, which is the figure BRIEF.md §7 names for the hero shader. On a
      // 3× phone the difference between this and the usual 2 cap is 4×
      // the fragments for a field of soft light nobody can resolve.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(host.clientWidth * dpr));
      const h = Math.max(1, Math.round(host.clientHeight * dpr));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    observer?.observe(host);

    const pointer = { x: 0.5, y: 0.5, targetActive: 0, active: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = (e.clientY - rect.top) / rect.height;
      pointer.targetActive = 1;
    };
    const onPointerLeave = () => {
      pointer.targetActive = 0;
    };
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    host.addEventListener("pointercancel", onPointerLeave);

    let phase = 0;
    let last = performance.now();
    let frame = 0;

    /** Paint one frame at the current phase. */
    const paint = (dt: number) => {
      resize();

      const p = propsRef.current;
      const dir = p.direction === "down" ? -1 : 1;
      phase += dt * (p.speed / 10) * 3.0 * dir;

      const activeTarget = p.pointerReactive ? pointer.targetActive : 0;
      const easing = 1 - Math.exp(-dt * 8);
      pointer.active += (activeTarget - pointer.active) * easing;

      const bg = parseColor(p.background, [0, 0, 0, 1]);
      const glow = parseColor(p.glowColor, [0.133, 0.133, 1, 1]);

      gl.uniform2f(u.u_res, width, height);
      gl.uniform1f(u.u_phase, phase);
      gl.uniform4f(u.u_bg, bg[0], bg[1], bg[2], bg[3]);
      gl.uniform3f(u.u_glow, glow[0], glow[1], glow[2]);
      gl.uniform1f(u.u_ribbons, Math.max(1, Math.round(p.ribbons)));
      gl.uniform1f(u.u_twists, p.twists);
      gl.uniform1f(u.u_width, p.ribbonWidth / 100);
      gl.uniform1f(u.u_orientation, p.orientation === "vertical" ? 1 : 0);
      gl.uniform1f(u.u_slats, Math.max(1, Math.round(p.glass.slats)));
      gl.uniform1f(u.u_groove, p.glass.groove / 10);
      gl.uniform1f(u.u_edge, (p.glass.edgeLight / 10) * 1.5);
      gl.uniform1f(u.u_refract, (p.glass.refraction / 10) * 0.3);
      gl.uniform1f(u.u_magnify, (p.glass.magnify / 10) * 0.9);
      gl.uniform1f(u.u_intensity, (p.light.intensity / 10) * 34.0);
      gl.uniform1f(u.u_center, p.light.center / 100);
      gl.uniform1f(u.u_spread, Math.max(0.01, p.light.spread / 100));
      gl.uniform2f(u.u_pointer, pointer.x, pointer.y);
      gl.uniform1f(u.u_pointerStrength, pointer.active);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      // One frame, no clock. The composition is there; nothing moves, and no
      // rAF is ever scheduled.
      paint(0);
      return () => {
        observer?.disconnect();
        host.removeEventListener("pointermove", onPointerMove);
        host.removeEventListener("pointerleave", onPointerLeave);
        host.removeEventListener("pointercancel", onPointerLeave);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      };
    }

    let running = false;
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      // Integrate on elapsed time rather than per frame: the loop is a
      // constant angular velocity, and a per-frame step would stream at
      // double the rate on a 120Hz display.
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      paint(dt);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    };

    /*
     * Off screen is off. BRIEF.md §7 asks for any canvas below the fold to be
     * paused, and the hero leaves the viewport within one scroll — without
     * this the GPU keeps drawing a field of light nobody is looking at for
     * the whole of the rest of the page.
     */
    const visibility =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) start();
                else stop();
              }
            },
            { rootMargin: "120px" },
          )
        : null;

    if (visibility) visibility.observe(host);
    else start();

    // A backgrounded tab gets no rAF anyway, but this also drops the context's
    // work when the tab is merely hidden behind another window.
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visibility === null) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      visibility?.disconnect();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("pointercancel", onPointerLeave);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        position: "relative",
        inlineSize: "100%",
        blockSize: "100%",
        overflow: "hidden",
        background,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", inlineSize: "100%", blockSize: "100%" }}
      />
    </div>
  );
}
