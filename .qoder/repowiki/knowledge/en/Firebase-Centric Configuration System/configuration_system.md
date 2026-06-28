The CGMI Assessment & Governance Platform utilizes a **Firebase-centric configuration system** typical of serverless Single Page Applications (SPAs). Configuration is split between client-side JavaScript modules for runtime connectivity and declarative JSON files for infrastructure and security policies.

### 1. Core Configuration Approach
- **Hardcoded Client Config**: Firebase connection details (`apiKey`, `projectId`, etc.) are stored directly in `firebase-config.js`. This file serves as the single source of truth for initializing the Firebase SDK.
- **Declarative Infrastructure**: Hosting rules, database security, and indexing strategies are defined in static JSON/Rule files (`firebase.json`, `firestore.rules`, `firestore.indexes.json`) rather than dynamic environment variables.
- **No Environment Abstraction**: The project does not use `.env` files or build-time variable injection (e.g., via Webpack/Vite). Configuration is managed by manually editing source files.

### 2. Key Configuration Files
- **`firebase-config.js`**: Initializes the Firebase app. Contains sensitive project identifiers. It exports shared instances of `auth`, `db`, and `googleProvider` to be consumed by other modules.
- **`firebase.json`**: The main CLI configuration file. It defines:
  - **Hosting**: Serves the root directory (`.`) and rewrites all routes to `/index.html` to support client-side routing.
  - **Firestore**: Links to the local rules and indexes files.
- **`firestore.rules`**: Defines security logic directly in the backend configuration. It implements a custom `isAdmin()` function that checks for the existence of a user document in the `admins` collection, enabling role-based access control (RBAC) without a traditional backend server.
- **`.firebaserc`**: Maps the local project to the remote Firebase project ID (`cgmi-assessmentt`).
- **`firestore.indexes.json`**: Declares composite indexes required for complex queries (e.g., sorting assessments by date per user).

### 3. Architecture and Conventions
- **Security as Configuration**: Access control is not implemented in application logic (JS) but is enforced at the database level via `firestore.rules`. This ensures that even if the client-side code is bypassed, data remains protected according to the defined roles (Admin vs. User).
- **Static Asset Serving**: The `firebase.json` hosting configuration treats the entire repository root as the public directory, ignoring node_modules and dotfiles.
- **Manual Secret Management**: Since there is no `.env` pattern, developers must manually ensure that `firebase-config.js` is not committed to public repositories if they wish to keep API keys private (though Firebase API keys are generally considered safe to expose, other secrets like service account keys would not be).

### 4. Rules for Developers
- **Do not hardcode logic in rules**: Keep business logic in `utils/` and use `firestore.rules` strictly for authorization and validation.
- **Sync Indexes**: If new complex queries are added to `utils/firestore.js` or `pages/`, corresponding entries must be added to `firestore.indexes.json` and deployed via `firebase deploy --only firestore:indexes`.
- **Config Updates**: To change environments (e.g., staging vs. production), developers must manually swap the values in `firebase-config.js` and update `.firebaserc`, as there is no automated environment switching mechanism.