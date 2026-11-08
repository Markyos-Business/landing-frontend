# Using the Markyos CMS

**For whoever is writing and editing — no code needed.**

The admin panel is where the four resources are written: blog posts, guides,
help articles and comparison pages, each in Arabic and in English.

It does **not** edit the website's own text. The homepage, the navigation and
the announcement bar were editable here until 8 Nov 2026 and are now the
codebase's, where they are reviewed in a diff and checked for Arabic parity on
every build. Ask a developer for those.

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

- **Resources** — one card per section you can open: how much exists, how much
  of it is published, and how many drafts are waiting.

  Each card carries **a row per language**, because a piece of content is one
  record with an Arabic side and an English side, and "nine guides" can mean
  nine in Arabic and four in English. The bar is how much of that section has
  been written in that language, and clicking the row opens the list *in* that
  language — where anything unwritten shows as `<No Title>`. That is the
  quickest way to see what still needs translating.
- **Traffic** (admins only) — page views and visitors for the last 30 days,
  each with the change against the 30 days before, a daily chart, the top
  pages, where people came from, and the split by language, device and country.
- **Library and taxonomy** — the images, authors, categories and tags the
  resources are assembled from.

Traffic is counted first-party: no cookies, no third-party script, and no IP
address is stored. A visitor is recognised within a day by a hash that is
thrown away overnight, so "visits" and "visitors" can differ without anyone
being followed. Browsers asking not to be tracked are honoured, and obvious
bots are excluded.

---

## The left-hand menu

| Group | What is in it |
| :--- | :--- |
| **Resources** | Blog posts · Guides and templates · Help centre · Comparisons · What's new |
| **Library** | Media |
| **Taxonomy** | Authors · Categories · Tags |
| **Settings** | Redirects · Page views · Users |

Everything in **Resources** is a page on the site: `/blog`, `/guides`,
`/help`, `/compare` and `/whats-new`. Media is in its own group because it is
not one of those — it is what they are made of.

**Everything on those four pages is in here.** Until 8 November 2026 it was
not: the blog listed thirteen posts and this panel listed one, because
thirty-one of the pieces were written into the code and only shown on the
site. They are all documents now, so if you cannot find something a reader can
see, that is a fault worth reporting rather than the way it works.

---

## Placeholder content

Thirty-one of the pieces in Resources were written so the page designs could
be reviewed against real text. They are real titles from the content plan with
bodies that have not been through the review the rest of the site has, and
they are marked: **Placeholder content**, a checkbox in the sidebar of every
post, guide and help article.

While it is ticked, the article carries a notice saying so, and the index it
sits on is kept out of Google for as long as *every* piece on it is ticked.
Placeholder writing that ranks is placeholder writing that gets quoted back at
you.

Clearing the tick is how a piece becomes finished writing. Rewrite the body,
untick the box, save. Nothing else has to happen, and nobody has to deploy
anything.

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

## The website's own text is not edited here

The homepage copy, the navigation and the announcement bar used to be editable
from **Website content**. They are not any more, as of 8 Nov 2026: that whole
group is gone and the admin is the resources CMS.

The copy lives in the codebase, in `content/`. Changing it is a developer task
and a pull request, which is the point — every line of that copy traces back
to a decision in the strategy document, so a change to it is a positioning
decision rather than a typo fix:

- The headline is **three verbs** because they are the three jobs: build
  (the studio), hand it over (the moment of value), keep it alive (the
  company).
- The two buttons have **equal visual weight** on purpose. Making one the
  obvious choice tells half the audience they are the wrong half.
- The voice is: short sentences, "you" and "your client" more than "we", real
  nouns over adjectives, **no exclamation marks**, and never
  "revolutionary", "seamless", "leverage" or "unlock".
- Where a section says something is coming later, that chip is generated from
  the real build status. Nobody writes "coming soon" into the copy by hand.

Going through the codebase also means Arabic cannot quietly fall behind:
`npm run check:locales` fails the build when an English line has no Arabic.

---

## Previewing

The **Live Preview** tab, on any resource, shows the real page with your
changes in it at phone, tablet and desktop widths, updating as you type. Use
it, particularly for Arabic, where the whole layout mirrors.

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
nothing else. No traffic figures, no other sections, no ability to publish,
and no way to delete anything.

### What stays with admins, always

Publishing, deleting, traffic, redirects, the taxonomy and the user list. A
section gives somebody the blog; it never gives them the ability to publish
it.

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

If an article has reverted to text you did not write, that is the fallback
doing its job: the CMS is unreachable and the site is serving its built-in
copy. That is a developer question rather than a content one, and the site
stays up either way.
