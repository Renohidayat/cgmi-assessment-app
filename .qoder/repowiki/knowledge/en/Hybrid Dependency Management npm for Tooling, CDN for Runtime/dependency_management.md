The CGMI Assessment & Governance Platform employs a hybrid dependency management strategy that separates build-time tooling from runtime library consumption.

### 1. Dependency Systems
- **npm (Node Package Manager)**: Used exclusively for managing development utilities and specific server-side compatible libraries. The `package.json` defines two direct dependencies: `firebase` (^12.15.0) and `jsonwebtoken` (^9.0.3). 
- **ES Modules via CDN**: The core application logic in `firebase-config.js` bypasses the local `node_modules` entirely, importing Firebase SDKs directly from Google's CDN (`https://www.gstatic.com/firebasejs/10.12.2/...`). This indicates a "zero-bundle" or "no-build" architecture where the browser resolves dependencies at runtime.

### 2. Key Files
- **`package.json`**: Declares top-level dependencies. Notably, it lacks a `name` and `version` field, suggesting it is not intended for publication to the npm registry but serves as a local manifest for tooling.
- **`package-lock.json`**: Locks the dependency tree for npm, ensuring consistent installation of the ~1,180 packages required by `firebase` and `jsonwebtoken`. It uses `lockfileVersion: 3`.
- **`firebase-config.js`**: The primary entry point for backend services. It hardcodes specific CDN URLs for Firebase modules, creating a potential version mismatch with the `package.json` declaration (CDN uses v10.12.2, package.json declares ^12.15.0).
- **`firebase.json`**: Configures Firebase Hosting, explicitly ignoring `node_modules` in the public deployment directory, reinforcing that `node_modules` are not served to the client.

### 3. Architecture and Conventions
- **No Bundler Strategy**: The project does not use Webpack, Vite, or Rollup. Dependencies are not bundled into a single `dist` file. Instead, the application relies on the browser's native ES Module support to fetch libraries from CDNs.
- **Version Divergence**: There is a significant discrepancy between the Firebase version declared in `package.json` (v12) and the version imported in `firebase-config.js` (v10). This suggests that `package.json` may be used for local testing with `npx serve` or for specific Node.js-based scripts, while the production client code is pinned to an older CDN version.
- **Private Keys in Source**: The `firebase-config.js` file contains hardcoded API keys and project identifiers. While Firebase API keys are generally safe to expose, this practice couples configuration directly to the source code, bypassing environment variable management typically seen in more complex dependency setups.

### 4. Rules for Developers
- **Do Not Commit `node_modules`**: The `.gitignore` (implied by standard practices and `firebase.json` ignore rules) should exclude `node_modules`. Dependencies must be reinstalled via `npm install`.
- **Sync CDN and npm Versions**: Developers should ensure that the version imported in `firebase-config.js` matches the intent of `package.json` to avoid unexpected behavior between local development and production.
- **Use `npx serve` for Local Dev**: The `scripts` section in `package.json` defines `dev` and `start` using `npx serve .`, indicating that the local development server serves static files directly without a build step.