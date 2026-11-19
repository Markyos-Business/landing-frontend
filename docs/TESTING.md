# Website and CMS verification

Run `npm run check` for types, lint, design, languages, pricing, authentication
handoff and backend connection contracts. Build an isolated copy for browser
checks so the user's dev server and its .next cache remain untouched.

For signup checks, set CONTENT_API_URL to a disposable Django backend with the
latest migrations, start an isolated website at localhost:3213 and run:

```bash
BASE_URL=http://localhost:3213 PLAYWRIGHT_CHANNEL=chrome npm run check:waitlist
```

This creates synthetic signup records in that backend. It covers all four
request topics/types, validation, malformed JSON, honeypot discard and saved
messages in Arabic/English. It must not point at production. Backend tests in
`apps/content/test_web_workflows.py` verify persistence, deduplication, throttle,
publishing invalidation and stale version restore.

CMS roles are tested in the shared backend with:

```bash
venv/bin/python -m pytest apps/content
```

The old `check:cms-permissions` script targets retired Payload APIs; it is legacy
migration tooling, not a test of the active CMS. Current CMS editing lives in
the platform app. Its full checks and browser tests cover editor controls.

For publishing integration use a disposable backend and website sharing
CONTENT_SITE_KEY, with CONTENT_REVALIDATE_URL pointing to the test website's
/api/revalidate. Verify new articles render after the build, drafts stay private,
republished title/slug changes invalidate both language routes, unpublishing
removes public articles, and analytics writes reach that same database. Mocked
checks alone do not establish production configuration; verify deployment
origins and shared keys separately without exposing their values in logs.
