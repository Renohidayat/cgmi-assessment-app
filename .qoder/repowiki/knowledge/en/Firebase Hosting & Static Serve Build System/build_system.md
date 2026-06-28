The CGMI Assessment & Governance Platform employs a lightweight, serverless build and deployment strategy centered around **Firebase Hosting** and a static file serving model. There is no complex compilation step (e.g., Webpack, Vite) or containerization (Docker); the application is a vanilla JavaScript Single Page Application (SPA) served directly from the repository root.

### Build & Development Approach
- **Zero-Build Frontend**: The project uses vanilla ES6+ JavaScript modules and Tailwind CSS via CDN. This eliminates the need for a transpilation or bundling step during development or production builds.
- **Local Development**: Developers use `npx serve .` (defined in `package.json` scripts `dev` and `start`) to spin up a local static server for testing.
- **Dependency Management**: Minimal Node.js dependencies are managed via `package.json`, primarily for local tooling (`serve`) and Firebase client libraries.

### Deployment Pipeline
- **Firebase Hosting**: The core deployment target is Firebase Hosting, configured via `firebase.json`. 
  - **SPA Routing**: Rewrites all non-file requests to `/index.html` to support client-side hash-based routing.
  - **Ignore Rules**: Explicitly ignores `firebase.json`, dotfiles, and `node_modules` during deployment.
- **Configuration**: 
  - `.firebaserc` links the project to the Firebase project ID `cgmi-assessmentt`.
  - `firestore.rules` and `firestore.indexes.json` are deployed alongside the hosting content to manage backend security and query performance.

### Key Conventions & Rules
1. **No Build Artifacts**: Since there is no build step, the source files (`*.js`, `*.html`, `*.css`) are the production artifacts. Developers must ensure code is production-ready before committing.
2. **Firebase CLI Dependency**: Deployment relies on the Firebase CLI. Developers must have the CLI installed and authenticated (`firebase login`) to deploy updates.
3. **Environment Configuration**: Firebase configuration keys are stored in `firebase-config.js`. As noted in the implementation plan, these must be manually updated with valid project credentials, as they are not injected via a build process.
4. **Static Asset Management**: All assets (images, icons) are served directly from the root or `assets/` directory. Paths must be relative to the root `index.html`.

### Missing Elements
- **CI/CD**: No GitHub Actions, GitLab CI, or other automated pipeline configurations were found. Deployments are likely manual via `firebase deploy`.
- **Testing Framework**: No unit or end-to-end test configurations (e.g., Jest, Cypress) are present in the build system.