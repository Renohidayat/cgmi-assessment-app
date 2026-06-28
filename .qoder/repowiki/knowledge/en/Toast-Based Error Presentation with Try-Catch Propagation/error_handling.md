## Overview

This codebase uses an **informal, UI-centric error handling approach** built around JavaScript's native `try/catch` blocks combined with a custom toast notification system for user-facing error presentation. There is no centralized error middleware, error type hierarchy, or structured error logging framework.

---

## System and Approach

### 1. Toast Notification System (Primary Error Presentation)

The core mechanism for presenting errors to users is the `components/toast.js` module, which provides a non-blocking toast notification system with four severity levels:
- `toast.success()` — success confirmations
- `toast.error()` — error messages
- `toast.warning()` — validation warnings
- `toast.info()` — informational messages

Each toast auto-dismisses after a configurable duration (default 4000ms) and includes a manual close button. Errors are displayed as dismissible banners at the top of the viewport.

### 2. Native `try/catch` Blocks (Error Capture)

All asynchronous operations (Firestore reads/writes, authentication flows) are wrapped in `try/catch` blocks at the call site. This pattern appears consistently across:
- Page components (`pages/login.js`, `pages/register.js`, `pages/assessment.js`)
- Admin panels (`pages/admin/admin-admins.js`, `pages/admin/admin-questions.js`, etc.)
- Utility modules (`utils/auth.js`, `utils/firestore.js`)

### 3. Error Propagation via `throw new Error()`

Business logic functions that detect invalid states throw generic `Error` objects with descriptive Indonesian messages. Examples:
- `utils/auth.js:53` — `throw new Error('Kode Akses tidak ditemukan...')`
- `utils/auth.js:103` — `throw new Error('Akun Google Anda tidak terdaftar sebagai admin...')`

These thrown errors bubble up to the nearest `catch` block in the calling UI handler, where they are extracted via `err.message` and passed to `toast.error()`.

### 4. Console Logging for Debugging

A small number of `console.error()` and `console.warn()` calls exist for developer-facing diagnostics:
- `utils/firestore.js:157` — warns about direct admin lookup failure before falling back to query
- `utils/firestore.js:174` — logs query fallback failures
- `app.js:143` — logs admin metadata fetch failures
- `pages/assessment.js:77` — warns when Firestore question fetch fails, falls back to local cache

These are **not** part of a structured logging system; they are ad-hoc debug statements.

---

## Key Files

| File | Role |
|------|------|
| `components/toast.js` | Core toast notification component; defines `showToast()` and the `toast` helper object with `success/error/info/warning` methods |
| `utils/auth.js` | Throws `Error` on authentication failures (invalid Kode Akses, unregistered Google admin); catches and logs some internal errors |
| `utils/firestore.js` | Contains `try/catch` blocks with `console.warn`/`console.error` for fallback query logic; most CRUD functions do **not** catch errors internally, letting them propagate |
| `pages/login.js` | Demonstrates the canonical error handling pattern: `try { await authOp(); toast.success(...); } catch (err) { toast.error(err.message); }` |
| `pages/admin/admin-admins.js` | Shows repeated pattern of wrapping Firestore mutations in try/catch with toast feedback |
| `app.js` | Uses `try/catch` around auth state resolution; falls back gracefully on failure |

---

## Architecture and Conventions

### Error Flow Pattern

```
UI Event Handler
  └─ try {
       await businessLogicFunction();   // may throw Error
       toast.success("Operation succeeded");
     } catch (err) {
       toast.error(err.message);        // present error to user
     }
```

This pattern is applied uniformly across all interactive pages.

### Design Decisions

1. **No Custom Error Types**: All errors are plain `Error` instances. There is no error class hierarchy, error codes, or sentinel error values.

2. **Errors Are Caught at the UI Boundary**: Lower-level utility functions (`firestore.js` CRUD ops) generally do **not** catch errors themselves. They let exceptions propagate to the page-level handlers, which decide how to present them.

3. **Graceful Degradation in Select Cases**: A few functions implement fallback strategies:
   - `getAdminByEmail()` tries direct document fetch first, then falls back to field queries on failure
   - `assessment.js` falls back to local question cache if Firestore fetch fails

4. **User-Facing Messages in Indonesian**: All error messages presented via toast are in Indonesian, matching the application's localization.

5. **No Global Error Handler**: There is no `window.onerror`, `unhandledrejection` listener, or centralized error boundary. Each async operation must be individually wrapped.

6. **Validation Errors Use `toast.warning()` or `toast.error()`**: Input validation failures (e.g., empty fields, wrong format) are handled inline without throwing, using `toast.warning()` or `toast.error()` directly.

---

## Rules Developers Should Follow

1. **Always wrap async operations in `try/catch`** at the UI event handler level. Never let uncaught promise rejections escape to the console in production flows.

2. **Use `toast.error(err.message)`** to display caught errors to users. Do not use `alert()` or raw `console.error()` for user-facing feedback.

3. **Throw `new Error('descriptive message')`** from utility functions when a recoverable error condition is detected. Keep messages clear and in Indonesian for consistency.

4. **Use `toast.warning()` for input validation** issues that are the user's fault (wrong format, missing field). Use `toast.error()` for system/operation failures.

5. **Implement fallback strategies where feasible**. If a Firestore read can degrade gracefully (e.g., use cached data), catch the error and fall back rather than blocking the user.

6. **Reserve `console.error()` and `console.warn()` for developer diagnostics** only — situations where the team needs to investigate unexpected behavior. Do not rely on console output for user feedback.

7. **Do not swallow errors silently**. Every `catch` block should either re-throw, log to console, or present feedback via toast. Empty catch blocks are acceptable only when the failure is truly ignorable (e.g., `catch (_) { /* Firebase logout may fail if not logged in */ }`).
