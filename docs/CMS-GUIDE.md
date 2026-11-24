# Website CMS guide

Website content is edited inside the Markyos platform at `/admin/cms`. The
website uses the same Django backend as the app. Its `/admin` address redirects
to the platform CMS. Payload files remain only for legacy migration tooling.

## Access

Sign in with your existing platform account. A platform admin or content admin
must grant CMS access; there is no separate website “create first admin” flow.

- Content admins manage all content, publish/unpublish, delete, manage redirects,
  traffic and access.
- Editors create/edit drafts in assigned sections, upload media and contribute
  authors. They cannot publish or delete articles.
- Viewers read drafts in assigned sections without changing them.

Access is enforced by the backend, independently of what the sidebar shows.

## Write and publish

Choose All content or one of Blog, Guides, Help centre, Comparisons and What's
new. Create an article with its kind, slug and title, then edit its Arabic and
English content. Each language has its own title, excerpt, rich-text body,
SEO title/description, hero image and caption. A language needs its own title;
the website does not present another language's body under that language URL.

Set author, category, tags and display date. Guides can include a download and
checklist/template/worksheet type. Comparisons can name a competitor. Mark
unconfirmed material provisional so the website can distinguish it.

Save creates a draft version. Publishing creates the snapshot the website
reads. Later edits do not change that snapshot until published again. Unpublish
takes the article out of public API results. Two editors cannot silently save
over the same draft: a version conflict asks you to review the latest copy.

## Version history

Open Version history in the article editor to see the last 20 saved states,
with dates and editors. Contributors who can edit the article can restore a
saved state after confirmation. Restoration replaces the draft, including any
unsaved edits, but does not publish it. Restore checks the current draft version
so a newer server save is not silently overwritten. Viewers can inspect the
history but cannot restore.

## Library and management

Media contains uploaded images/files with bilingual alt text and credits.
Authors and labels manages authors, categories and tags. Content admins manage
301/302 redirects and CMS people/access. Traffic shows the last 30 days of views,
visitors, daily activity, top pages, referrers and devices.

Signup submissions are stored in the shared backend. Operators can review
Website signups in Django admin, filtering topic/language and searching email.
The website confirms storage only; it does not send newsletter confirmation or
campaign emails automatically.

## What remains maintained in code

Homepage, pricing, legal and solution-page copy live in the landing repository.
They are not a generic CMS page builder. Author biography/avatar fields exist
in the backend, but the current author form edits name and bilingual roles.
A dedicated unpublished website preview is not implemented.

## Environments and publishing

The website server uses CONTENT_API_URL for the shared backend. Development
defaults to localhost:8010/api/v1; production and preview have their own API
origins. NEXT_PUBLIC_APP_URL connects website authentication and CMS links to
the correct platform app.

For immediate publishing updates, set CONTENT_REVALIDATE_URL on the backend to
the website's `/api/revalidate`, and use the same CONTENT_SITE_KEY on both
services. The key also signs analytics ingestion. Publishing invalidates content
reads, collection pages, affected article paths in both languages and the
sitemap. Renamed articles invalidate both old and new URLs. Failed hooks are
logged and do not undo publishing; hourly cache revalidation is the fallback.
Tracking is disabled/refused when the shared site key is missing.

Deploy backend migrations before the website signup route. Check publishing,
unpublishing, slug changes and analytics against the intended environment;
local tests do not prove that production secrets have been configured.
