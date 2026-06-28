# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [firebase.json](file://firebase.json)
- [firebase-config.js](file://firebase-config.js)
- [index.html](file://index.html)
- [app.js](file://app.js)
- [utils/auth.js](file://utils/auth.js)
- [utils/firestore.js](file://utils/firestore.js)
- [pages/login.js](file://pages/login.js)
- [pages/register.js](file://pages/register.js)
- [pages/dashboard.js](file://pages/dashboard.js)
- [pages/admin/admin-layout.js](file://pages/admin/admin-layout.js)
- [firestore.rules](file://firestore.rules)
- [firestore.indexes.json](file://firestore.indexes.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Setup](#environment-setup)
5. [Firebase Configuration](#firebase-configuration)
6. [Local Development](#local-development)
7. [Initial Verification](#initial-verification)
8. [Firebase Authentication Setup](#firebase-authentication-setup)
9. [Firestore Database Configuration](#firestore-database-configuration)
10. [Security Rules Deployment](#security-rules-deployment)
11. [Troubleshooting](#troubleshooting)
12. [Quick Start Examples](#quick-start-examples)
13. [Conclusion](#conclusion)

## Introduction
This guide helps you install and run the CGMI Assessment App locally, configure Firebase services, and verify the setup. The application is a client-side Single Page Application (SPA) that uses Firebase Authentication and Firestore for user management, assessments, and administration.

## Prerequisites
Before installing the CGMI Assessment App, ensure you have:
- Node.js installed on your development machine
- A Firebase project ready in the Firebase Console
- Basic understanding of web development and npm scripts

These prerequisites are required to run the local development server and deploy Firebase resources.

**Section sources**
- [package.json:1-11](file://package.json#L1-L11)

## Installation
Follow these steps to clone and prepare the project:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using npm.

The project uses a static file server during development, so no bundler is required.

**Section sources**
- [package.json:2-4](file://package.json#L2-L4)

## Environment Setup
The application loads Firebase configuration from a module that exports initialized Firebase instances. The configuration file contains placeholder values that must be replaced with your Firebase project credentials.

Key configuration points:
- Firebase SDK modules are imported from CDN URLs
- The configuration object holds your Firebase project keys
- Exports initialized auth, db, and provider instances

Important: Replace the placeholder values in the configuration file with your actual Firebase project settings before proceeding.

**Section sources**
- [firebase-config.js:10-27](file://firebase-config.js#L10-L27)

## Firebase Configuration
The application expects a Firebase project configured with:
- Authentication enabled (both Email/Password and Google providers)
- Firestore database created
- Hosting configured for static hosting

Configure these in the Firebase Console before deploying or testing locally.

**Section sources**
- [firebase.json:6-19](file://firebase.json#L6-L19)

## Local Development
Start the local development server using the npm script defined in the project configuration. The server serves static files from the project root.

Steps:
1. Ensure you are in the project directory
2. Run the development command
3. Open your browser to the local URL shown by the server

The SPA entry point is the HTML file that loads the application module.

**Section sources**
- [package.json:2-4](file://package.json#L2-L4)
- [index.html:75](file://index.html#L75)

## Initial Verification
After starting the server, verify the application loads correctly:
- The main page renders without errors
- Navigation elements are visible
- The routing system responds to hash changes

If you encounter issues, check the browser console for JavaScript errors related to missing Firebase configuration or network requests.

**Section sources**
- [app.js:163-167](file://app.js#L163-L167)

## Firebase Authentication Setup
The application supports two authentication modes:
- User login via a 6-digit Kode Akses (stored in Firestore)
- Admin login via Google OAuth (Firebase Authentication)

To enable Google sign-in:
1. Enable Google provider in Firebase Authentication
2. Configure authorized domains for OAuth redirect
3. Ensure the Firebase configuration matches your project

User registration creates a Firestore document with a generated Kode Akses. Admins are identified by Firestore documents in the admins collection.

**Section sources**
- [utils/auth.js:58-104](file://utils/auth.js#L58-L104)
- [utils/auth.js:31-47](file://utils/auth.js#L31-L47)
- [pages/login.js:10-44](file://pages/login.js#L10-L44)

## Firestore Database Configuration
The application uses three Firestore collections:
- users: stores organization user profiles and Kode Akses
- admins: stores administrator records
- questions: stores survey questions
- assessments: stores assessment submissions

Indexes are defined to optimize common queries. Ensure these indexes are deployed along with your security rules.

**Section sources**
- [utils/firestore.js:18-49](file://utils/firestore.js#L18-L49)
- [utils/firestore.js:54-88](file://utils/firestore.js#L54-L88)
- [utils/firestore.js:94-116](file://utils/firestore.js#L94-L116)
- [utils/firestore.js:122-141](file://utils/firestore.js#L122-L141)
- [firestore.indexes.json:1-22](file://firestore.indexes.json#L1-L22)

## Security Rules Deployment
Deploy the Firestore security rules included in the project. These rules:
- Allow public read/write for user profiles
- Restrict admin whitelist and assessment writes to authenticated admins
- Allow public read for questions

Apply the rules using the Firebase CLI or Firebase Console.

**Section sources**
- [firestore.rules:1-38](file://firestore.rules#L1-L38)

## Troubleshooting
Common setup issues and resolutions:
- Blank page or console errors: Verify Firebase configuration values are correctly set in the configuration file
- Authentication failures: Confirm Google provider is enabled and authorized in Firebase
- Missing data in admin panel: Ensure admin Firestore documents exist and match the authenticated user
- CORS or CDN errors: Check that Firebase SDK CDNs are accessible from your environment

For routing issues, confirm hash-based navigation is working and routes match the expected patterns.

**Section sources**
- [firebase-config.js:14-21](file://firebase-config.js#L14-L21)
- [pages/login.js:70-109](file://pages/login.js#L70-L109)
- [app.js:75-101](file://app.js#L75-L101)

## Quick Start Examples
Run the application locally and test user roles:

1. Start the local server using the npm script
2. Access the login page and choose the appropriate tab:
   - For users: enter a valid 6-digit Kode Akses
   - For admins: use Google sign-in with an authorized account
3. After successful authentication:
   - Users land on the dashboard and can take assessments
   - Admins land on the admin panel with full access

Admin panel navigation includes:
- Dashboard overview
- Respondent data management
- Question management
- Multi-admin configuration

**Section sources**
- [package.json:2-4](file://package.json#L2-L4)
- [pages/login.js:111-129](file://pages/login.js#L111-L129)
- [pages/dashboard.js:117-134](file://pages/dashboard.js#L117-L134)
- [pages/admin/admin-layout.js:6-62](file://pages/admin/admin-layout.js#L6-L62)

## Conclusion
You now have the CGMI Assessment App running locally, with Firebase Authentication and Firestore configured. Use the troubleshooting section if you encounter issues, and refer to the quick start examples to verify user and admin workflows.