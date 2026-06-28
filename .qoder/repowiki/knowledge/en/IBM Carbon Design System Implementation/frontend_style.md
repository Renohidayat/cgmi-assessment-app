# Frontend Style: IBM Carbon Design System

The CGMI Assessment & Governance Platform implements a strict **IBM Carbon Design System** aesthetic, characterized by flat-square geometry, light-weight display typography, and a single-brand accent color (IBM Blue #0f62fe).

## 1. System & Approach

### Core Methodology
- **Design System**: IBM Carbon Design System (enterprise-grade, open-source).
- **CSS Architecture**: Custom CSS with CSS Variables (Design Tokens) in `styles/main.css`.
- **Utility Framework**: Tailwind CSS (Play CDN) is included but heavily neutralized to prevent conflicts with the Carbon aesthetic.
- **Typography**: IBM Plex Sans (weights 300 for display, 400/600 for body/emphasis).
- **Icons**: Material Symbols Outlined.

### Key Design Principles
- **Flat Geometry**: All corners are square (`border-radius: 0`) except for specific small badges or avatars. No drop shadows, no atmospheric gradients on UI components.
- **Single Accent Color**: IBM Blue (#0f62fe) is the only chromatic accent used for primary CTAs, links, and focus states.
- **Surface Hierarchy**: Depth is conveyed through 1px hairline borders and surface color changes (White `#ffffff` → Light Gray `#f4f4f4`), not shadows.
- **Precision Spacing**: Based on a 4px grid system.

## 2. Key Files & Packages

| File | Purpose |
|------|---------|
| `styles/main.css` | **Core style engine**. Defines all Carbon design tokens (colors, spacing, typography) and component classes (`.carbon-button`, `.carbon-card`, `.carbon-input`). |
| `DESIGN.md` | **Design specification**. Detailed YAML/Markdown document defining the Carbon token system, component variants, and usage rules. |
| `index.html` | **Entry point**. Loads IBM Plex Sans from Google Fonts, Tailwind CDN, and custom styles. |
| `components/navbar.js` | **Navigation**. Implements the sticky topbar using `.carbon-topbar` classes. |
| `pages/home.js` | **Landing page**. Uses a mix of Carbon classes and custom dark-mode hero sections. |

## 3. Architecture & Conventions

### Design Tokens (CSS Variables)
Defined in `:root` of `styles/main.css`:
- **Colors**: `--carbon-primary` (#0f62fe), `--carbon-ink` (#161616), `--carbon-canvas` (#ffffff), `--carbon-surface-1` (#f4f4f4).
- **Spacing**: `--carbon-spacing-xs` (8px) to `--carbon-spacing-xxl` (48px).
- **Typography**: `--carbon-font` ('IBM Plex Sans').
- **Radius**: `--carbon-radius-none` (0px), `--carbon-radius-xs` (2px).

### Component Classes
The system uses a BEM-like naming convention prefixed with `carbon-`:
- **Buttons**: `.carbon-button` (primary), `.carbon-button-secondary`, `.carbon-button-tertiary`, `.carbon-button-danger`.
- **Cards/Panels**: `.carbon-card` (padded, bordered), `.carbon-panel` (smaller padding).
- **Inputs**: `.carbon-input` (bottom-border only style, typical of Carbon).
- **Navigation**: `.carbon-topbar`, `.carbon-sidebar`.
- **Utilities**: `.carbon-badge`, `.carbon-tabs`, `.carbon-table`.

### Tailwind Neutralization
A significant portion of `main.css` (lines 661–688) is dedicated to **neutralizing Tailwind utilities** that conflict with Carbon:
```css
[class*="shadow"] { box-shadow: none !important; }
[class*="rounded-"] { border-radius: 0 !important; }
.bg-gradient-to-* { background-image: none !important; }
```
This ensures that even if Tailwind classes are accidentally applied, the flat Carbon aesthetic is preserved.

### Dark Mode Strategy
The application uses a **hybrid theme**:
- **Admin/Dashboard UI**: Strictly follows Carbon Light Theme (white canvas, charcoal text).
- **Home/Landing Page**: Uses a custom dark theme (`#0a0a0a` background) with high-contrast white text and IBM Blue accents, deviating from standard Carbon for marketing impact.

## 4. Rules for Developers

### Do's
- **Use Carbon Classes**: Prefer `.carbon-button`, `.carbon-card`, `.carbon-input` over raw Tailwind classes for UI consistency.
- **Square Corners**: Keep `border-radius: 0` for all primary UI elements (buttons, cards, inputs).
- **IBM Blue Only**: Use `#0f62fe` for primary actions and links. Do not introduce new brand colors.
- **Light Display Type**: Use `font-weight: 300` for large headlines (≥32px) to match the Carbon "light display" signature.
- **Hairline Borders**: Use 1px borders (`var(--carbon-hairline)`) for separation instead of shadows.

### Don'ts
- **No Rounded Pills**: Avoid `rounded-full` or `rounded-lg` on buttons/cards.
- **No Drop Shadows**: Do not use `shadow-md` or similar Tailwind shadow utilities.
- **No Gradients on UI**: Avoid background gradients on buttons or cards (except for the specific home-page hero highlight).
- **Don't Bold Headlines**: Resist using `font-weight: 700` for large titles; use 300 or 400.

### Responsive Strategy
- **Grid**: 16-column Carbon grid at desktop, scaling to 8/4 columns at tablet/mobile.
- **Breakpoints**: Max-width 1584px. Mobile menu triggers below 1024px (md).
- **Touch Targets**: Minimum 48px height for buttons and inputs on touch devices.
