# Using the Markyos CMS

**For whoever is writing and editing — no code needed.**

The admin panel is where blog posts, guides, help articles and comparison
pages are written, and where the website's own text can be changed without a
developer.

```
Local:       http://localhost:3000/admin
Production:  https://cms.markyos.com
```

---

## First time

Open `/admin`. If nobody has an account yet it asks you to create the first
one — that account is an **Admin**. After that, new people are invited from
**Settings → Users**.

The admin is available **in Arabic**. Pick your interface language from your
account menu — it is separate from the language you are writing in, so you can
work in an Arabic interface on English content or the other way round. The whole
panel mirrors to right-to-left when you choose Arabic.

---

## The dashboard

The first screen after signing in. It shows:

- **Your content** — how much is published in each section you can open, and
  how many drafts are waiting.
- **Traffic** (admins only) — page views and visitors for the last 30 days,
  each with the change against the 30 days before, a daily chart, the top
  pages, where people came from, and the split by language, device and country.
- **The website itself** (admins only) — shortcuts into the homepage copy, the
  navigation and the announcement bar.

Traffic is counted first-party: no cookies, no third-party script, and no IP
address is stored. A visitor is recognised within a day by a hash that is
thrown away overnight, so "visits" and "visitors" can differ without anyone
being followed. Browsers asking not to be tracked are honoured, and obvious
bots are excluded.

---

## The left-hand menu

| Group | What is in it |
| :--- | :--- |
| **Content** | Blog posts · Guides and templates · Help centre · Comparisons · Media |
| **Website content** | Homepage · Navigation · Announcement bar |
| **Taxonomy** | Authors · Categories · Tags |
| **Settings** | Site settings · Redirects · Users |

---

## Writing a blog post

1. **Blog posts → Create new.**
2. Write the **title**. The slug (the bit in the URL) fills itself in — you can
   change it, but see the warning below.
3. Write an **excerpt**: one or two sentences. It is what shows on the blog
   index and in Google results.
4. Write the **body** in the editor. The toolbar is always visible across the
   top. Headings start at **H2** — the page already provides the H1, and two
   H1s on a page is a real problem for screen readers and for search.
5. In the sidebar, pick an **author**, a **category**, and a **hero image**.
6. **Save as draft** while you work. Nothing is public until you press
   **Publish**.

The post appears on the site within seconds of publishing. You do not need a
developer and nothing needs redeploying.

### Writing it in Arabic

**Do not create a second post.** One post holds both languages.

At the top of the editor there is a **locale switcher** — `English` and
`العربية`. Switch it, and the title, excerpt and body become the Arabic
versions of the same post. The slug, hero image, author and category are
shared.

If you leave the Arabic empty, an Arabic reader sees the English. That is
deliberate — an empty page is worse — but it is a gap, not a finished state.

> **Why one document:** two separate posts drift. One gets updated, the other
> does not, and six months later the Arabic says something the English stopped
> saying. That is the exact problem this product sells against; we are not
> going to build it into our own blog.

### A warning about slugs

Once a post is published, its slug is a URL other people have linked to.
Changing it breaks every one of those links.

If you must change it, go to **Settings → Redirects** and add one: the old path
in `from`, the new one in `to`, type **301**. Takes ten seconds and saves the
traffic.

---

## Editing the website's own text

**Website content → Homepage.**

This is organised in tabs — Hero, Problem & shift, Paths, Tone checker, and so
on — matching the order of the page as you scroll it.

**Every field is optional.** Leave one empty and the site uses its built-in
copy. Fill one and yours replaces it. So you can change one headline without
touching anything else, and you can never accidentally blank the homepage by
clearing a field.

Same for **Navigation** and the **Announcement bar**.

### Please read before changing homepage copy

This copy is not placeholder text. Every line of it traces back to a decision
in the strategy document:

- The headline is **three verbs** because they are the three jobs — build
  (the studio), hand it over (the moment of value), keep it alive (the
  company).
- The two buttons have **equal visual weight** on purpose. Making one the
  obvious choice tells half the audience they are the wrong half.
- The voice is: short sentences, "you" and "your client" more than "we", real
  nouns over adjectives, **no exclamation marks**, and never
  "revolutionary", "seamless", "leverage" or "unlock".
- Where a section says something is coming later, that chip is generated from
  the real build status. Do not write "coming soon" into the copy by hand.

Changing a headline here is a positioning decision, not a typo fix. Fixing an
actual typo is, of course, just a typo fix.

### Previewing

The **Live Preview** tab shows the real page with your changes in it, at
phone, tablet and desktop widths, updating as you type. Use it, particularly
for Arabic, where the whole layout mirrors.

---

## Images

**Content → Media**, or upload directly from a post.

**Alt text is required**, and it is **per language**. Describe what the image
shows, for people using a screen reader and for when the image fails to load.
If an image is purely decorative, a single space is the correct answer.

Resized versions are generated automatically, so upload the good one — a
large file will not slow the site down.

---

## Who can do what

Permission is **two settings**, not one. A role says how much someone can do;
sections say what they can do it to.

### Role — how much

| Role | Can |
| :--- | :--- |
| **Admin** | Everything: publishing, the website's own copy, traffic, and managing people |
| **Editor** | Writes and edits drafts. **Cannot publish** — an admin does that |
| **Viewer** | Reads drafts for review. Changes nothing |

### Sections — what over

Under **Settings → Users**, every non-admin gets a list of ticked sections:
Blog posts, Guides and templates, Help centre, Comparisons.

**Anything not ticked is not in their sidebar at all.** They do not see it,
cannot open it, and cannot reach it by typing the address either.

So a freelance copywriter you hire for the blog gets:

```
Role:     Editor
Sections: ☑ Blog posts   ☐ Guides   ☐ Help centre   ☐ Comparisons
```

and that account can write and edit blog posts, upload images for them, and
nothing else. No traffic figures, no homepage copy, no other sections, no
ability to publish, and no way to delete anything.

### What stays with admins, always

The website's own copy, the navigation, the announcement bar, site settings,
redirects, traffic, and the user list. A section gives somebody the blog; it
never gives them the homepage.

---

## Drafts, versions and undo

Every save creates a version. Open the **Versions** tab on any document to see
the history and **restore any previous one**. Twenty versions are kept per
document.

So: nothing you do here is unrecoverable, and "Publish" is always a separate,
deliberate action from "Save".

---

## If something looks wrong on the site

The site keeps a built-in copy of every page and falls back to it whenever the
CMS cannot be reached. So if a change does not appear:

1. Did you press **Publish**, or only **Save draft**?
2. Were you editing the right **language**? The switcher is at the top.
3. Give it a few seconds and reload.

If the homepage has reverted to text you did not write, that is the fallback
doing its job — the CMS is unreachable, and it is a developer question rather
than a content one. The site stays up either way.
