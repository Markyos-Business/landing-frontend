# Marketing and CMS regression checks

Run `npm run check` for TypeScript, lint, tokens, locale/copy parity and pricing
contracts. Build the site and run `npm run check:live` against its local server
for public-page, navigation, bidi and motion checks.

Use only a disposable CMS database for tests that write. Set `SQLITE_URL` to a
file under a temporary directory, initialize the schema and synthetic admin,
and start the build with that same database and `PAYLOAD_SECRET`. Never reuse a
personal or production CMS. A fresh production SQLite file needs schema setup;
opening public fallback pages does not initialize its tables.

```sh
BASE_URL=http://localhost:3213 PLAYWRIGHT_CHANNEL=chrome npm run check:waitlist
CMS_TEST_URL=http://localhost:3213 CMS_TEST_EMAIL=your-test-admin@example.test \
  CMS_TEST_PASSWORD='your-test-password' npm run check:cms-permissions
```

The permission check creates temporary editor/viewer users and content, then
removes them. It covers all five editorial collections: editor create/update
cannot publish, admin publication is public, viewer creation and editor
deletion are denied, user lists are self-only, and self-promotion is blocked.
Both `_status` create and update access must use `publishAccess` in every
collection with drafts. UI restrictions alone do not enforce publication.

The waitlist check covers topic-based public requests, legacy beta type
requests, validation, malformed JSON, honeypot discard and the Arabic/English
pending state in the real form. Storage/provider setup remains an explicit
[open decision](OPEN-DECISIONS.md#2-where-does-a-beta-signup-go); a 501 means
nothing was saved, never a successful subscription.
