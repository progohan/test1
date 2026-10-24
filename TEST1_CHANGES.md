# Test1: enhancements 1–19

This is an isolated copy of progohan/EF at commit bfa766933760d66de0745240e24c9c035d533c86.
It does not write to, publish, or change the EF repository or its Pages site.
Changes 1–5 preserved the original content and CV. Changes 6–19 keep the approved experience and year figures, but regenerate the CV from the website's source data.

## 1. Manual deployment

The deployment condition accepts both pushes to main and manual runs from main.
Both paths must pass the same checks. Other branches and pull requests cannot publish.

## 2. Review/deployment isolation

Review checks use per-PR/per-branch concurrency. Deployment has a separate group and is not
cancelled while publishing. Only the deployment job receives Pages and OIDC write permissions.

## 3. Automated checks

Run `npm run check` for lint, content validation, interaction tests, production build,
and published-file checks. Tests cover data loading/errors, mobile navigation, project
filtering, keyboard opening, and closing project details. They are DOM component tests,
not a full cross-browser or accessibility certification.

## 4. Reproducible installation

Use the exact Node version in .nvmrc and npm version in package.json. Run `npm ci`, not
`npm install`, for ordinary development and CI. The lockfile is regenerated from a clean
dependency directory, with platform-specific optional packages retained.

## 5. Dependency maintenance

Unused react-router-dom and @hookform/resolvers dependencies are removed. Zod is upgraded
to its patched major version; content validation and application tests verify compatibility.
Production high/critical advisories block deployment. A separate weekly audit includes
development dependencies. Dependabot proposes updates; it does not merge them automatically.

The Vite/React build plugin and Vitest runner are upgraded together to compatible patched
versions. The clean install and complete test/build suite verify the new toolchain.
Three moderate audit findings remain in Tailwind 3's CSS build-tool selector-parser
dependency chain. npm also reports them in the production dependency graph because of
peer dependencies in the original dependency graph; they are not ignored or suppressed.
After change 17, the production-only audit reports zero vulnerabilities. The full audit
still reports these three moderate development-tool findings.
A Tailwind 4 styling migration is intentionally deferred to avoid unrelated visual changes.

## Publishing enabled for test1

The owner approved making only test1 public and publishing this test portfolio.
GitHub Pages uses GitHub Actions. Pushes to main and manual runs from main publish only
after the full checks pass; pull requests and other branches do not publish.
No secrets or repository deployment variable are required.
The build base is /test1/ locally; CI derives it from the current repository name.

## Remaining enhancements (6–19)

6. Centralized navigation, introductory copy, competencies and credential badges in data.json.
7. Zod-first inferred types, structured job/project dates, numeric values, currencies and coordinate validation.
8. CV generated from the same data; source/PDF hashes detect stale downloads. Generator needs Python, ReportLab and Linux DejaVu Sans fonts.
9. Accessible project dialog with focus containment, Escape dismissal and focus restoration.
10. Skip link, native timeline buttons, filter states, responsive navigation and reduced-motion support.
11. Charts load near the viewport; maps only after explicit request.
12. Social metadata points to test1 and an existing public portrait; preview remains noindex.
13. Full portfolio HTML is prerendered, with validated embedded data and a shared render timestamp for hydration.
14. Explicit approximate project coordinates replace keyword matching and office-position fallbacks.
15. Visible metric assumptions distinguish full project values from attributable revenue/budget. Legacy year estimates and FX factors are retained, with limitations disclosed.
16. Contact form explicitly opens an email draft; users review and send through their email application.
17. Unused template components, assets and dependencies removed. Original files remain recoverable in Git history.
18. README replaced with test1-specific build/deployment/content guidance; obsolete remote-changing deployment helper removed.
19. Friendly reload/retry states replace visitor-facing technical error details.

The owner approved committing and publishing changes 6–19 to test1 only.
