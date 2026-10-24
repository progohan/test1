# Test1: approved enhancements 1–5

This is an isolated copy of progohan/EF at commit bfa766933760d66de0745240e24c9c035d533c86.
It does not write to, publish, or change the EF repository or its Pages site.
Portfolio wording, experience-year calculations, and the existing CV are unchanged.

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
peer dependencies; they are not ignored or suppressed. Both audit commands report them.
A Tailwind 4 styling migration is intentionally deferred to avoid unrelated visual changes.

## Publishing enabled for test1

The owner approved making only test1 public and publishing this test portfolio.
GitHub Pages uses GitHub Actions. Pushes to main and manual runs from main publish only
after the full checks pass; pull requests and other branches do not publish.
No secrets or repository deployment variable are required.
The build base is /test1/ locally; CI derives it from the current repository name.

The original README and older deployment instructions describe EF, not the isolated test setup.
Use this file for test1; do not run the old deployment helper.
