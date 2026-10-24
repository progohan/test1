# Eduardo's portfolio - test1

This is the isolated test portfolio. It must never publish or push to progohan/EF.
The preview uses https://progohan.github.io/test1/ and deliberately has noindex metadata
to avoid competing with the original portfolio in search results.

## Development

Use Node 24.22.1 (`nvm use`) and npm 11.9.0. Then:

```sh
npm ci
npm run dev
npm run check
```

`npm run check` runs lint, TypeScript checks, source/CV validation, component and
regression tests, both production builds, HTML pre-rendering, and published-file checks.
The application is hydrated from its generated HTML and embedded validated content.
Charts load near the viewport; the project map loads only on request.

## Content source

Edit public/data.json. It owns personal details, work experience, education, credential
badges, section introductions, competency descriptions, project dates/values, map locations,
and calculation assumptions. src/types.ts defines the validation schema and derives
TypeScript types from it. Components own presentation and generic interface labels.

Jobs and projects include structured dates and numeric project values. Original display
strings are retained for compatibility; validation rejects inconsistent job dates or values.
Project map coordinates are approximate, not surveyed. Never infer a new project's location
from a broad keyword or use an office address as a project location.

Keep factual claims evidence-backed. The existing experience-year wording, rounding, and
legacy sector-year estimates are intentionally retained at the owner's request. The UI
and calculation notes identify sector figures as estimates, not elapsed working time.
Fixed FX factors are illustrative, with the original reference date unknown. Portfolio
value means full listed project values, including pursuits; it is not attributable revenue.

## Update the CV

After any content edit, regenerate the CV and source record:

```sh
python -m pip install -r requirements-cv.txt
python scripts/generate_cv.py
npm run validate:content
```

The generator requires DejaVu Sans fonts at `/usr/share/fonts/truetype/dejavu` (Debian/Ubuntu package `fonts-dejavu-core`).
Review the generated PDF visually before committing it. The content digest blocks stale
CV uploads. The CV now uses the same employer, dates, responsibilities, email, education,
and certifications as the website. No private employment details are added.

## Publish only test1

GitHub Pages is enabled with GitHub Actions. Pushes to main and manual workflow runs from
main publish after checks pass. PRs and other branches cannot publish. Only the deployment
job has Pages/OIDC write permissions. No secret or repository deployment variable is needed.
Deployment concurrency is separate from review checks. Do not disable the check gates.

VITE_BASE_PATH defaults to /test1/ locally. CI derives it from the repository name.
The build emits initial readable HTML, metadata, a working social image, and bootstrap data;
all core text and direct contact/CV links work without JavaScript. Interactive controls do not.

## Structure

- public/data.json: canonical content and assumptions
- public/profile.jpg: existing unmodified portrait, used by the page and sharing previews
- public/Eduardo_Fernandez_CV.pdf and cv-source.json: generated CV and drift guard
- src/components: presentation and accessible interactions
- src/components/ui: only the UI primitives actually used
- src/lib: metrics, formatting, and a shared render clock
- scripts: content/CV checks, CV generation, HTML pre-rendering, build smoke checks
- tests: data, navigation, modal, lazy-loading, rendering, and calculation regressions
- .github/workflows: quality gates, publication, and scheduled dependency audit

## Maintenance

Dependabot proposes changes; it does not merge them. Review each PR and its checks before
approval. Three moderate findings in the Tailwind 3 build-tool chain are documented in
TEST1_CHANGES.md; they are not suppressed. A Tailwind 4 migration remains a separate task.
The contact form opens an email draft; it does not deliver messages or store visitor data.
Error details remain in the console; visitors see a recovery action, not a stack trace.

Unused UI templates, hooks, old photos, and logos have been removed from this copy only.
They remain recoverable from earlier commits. The unsafe old remote-changing deployment
helper and superseded review documents were retired.
