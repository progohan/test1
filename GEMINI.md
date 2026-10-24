1# GEMINI Project Analysis: Eduardo's Construction Portfolio

## Project Overview

This project is a modern, responsive single-page portfolio website for Eduardo Fernández Ortiz, a professional in the construction and infrastructure industry. It showcases his professional experience, key projects, skills, and education.

The application is built using a modern frontend stack:

*   **Framework/Library:** React 18 with TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **UI Components:** Radix UI primitives, with a component-based architecture found in `src/components`.
*   **Data Source:** The portfolio's content is dynamically loaded from a single JSON file located at `public/data.json`. This allows for easy updates to personal information, experience, projects, and skills without changing the source code.

The project is configured for deployment on GitHub Pages.

## Building and Running

The project uses `pnpm` as the preferred package manager, but `npm` can also be used.

### Key Commands

*   **Install Dependencies:**
    ```bash
    pnpm install
    # or
    npm install
    ```

*   **Run Development Server:**
    Starts the development server, typically at `http://localhost:5173`.
    ```bash
    pnpm dev
    # or
    npm run dev
    ```

*   **Build for Production:**
    Bundles the application for production into the `dist/` directory.
    ```bash
    pnpm build
    # or
    npm run build
    ```

*   **Linting:**
    Runs ESLint to check for code quality and style issues.
    ```bash
    pnpm lint
    # or
    npm run lint
    ```

*   **Preview Production Build:**
    Serves the `dist/` directory to preview the production build locally.
    ```bash
    pnpm preview
    # or
    npm run preview
    ```

## Development Conventions

*   **Component-Based Architecture:** The application is structured into reusable React components located in `src/components`. UI-specific, reusable components (like buttons, cards, etc.) are in `src/components/ui`.
*   **Centralized Data:** All portfolio content is managed in `public/data.json`. To update any text or data on the website, this is the primary file to edit.
*   **Styling:** Styling is done using Tailwind CSS. Custom styles and overrides can be found in `src/index.css` and `tailwind.config.js`.
*   **TypeScript:** The project uses TypeScript for static typing, with type definitions for the resume data located in `src/App.tsx`.
*   **Routing:** The application is a single-page application. Navigation in the `Header` component is handled by smooth-scrolling to different sections of the page.
*   **Deployment:** The `DEPLOYMENT.md` file provides detailed instructions for deploying to GitHub Pages. The repository is set up for automatic deployment via GitHub Actions on every push to the `main` branch. The `vite.config.ts` specifies a `base` path of `/EFernandez/`, which is important for GitHub Pages deployment.
