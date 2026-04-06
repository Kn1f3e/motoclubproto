# VSE

Website project for promoting moto tourism.

## Tech Stack

- Vue 3
- Vite
- Vue Router
- JavaScript (ES modules)
- CSS3

## Features

- Authentication page (registration / login / password recovery)
- Home page with:
  - left collapsible sections menu
  - hero block
  - auto-playing photo slider
  - smooth animations for static and dynamically added/removed menu sections
- Club section with subpages:
  - Club charter
  - Friends and partners
  - Club media
  - Club plans and development
- Routes page
- Events page
- Moto Market & Service page
- Profile page with tabs:
  - Profile
  - Patches
  - Settings
  - Notifications
- Admin panel with 3 functional modules:
  - Patch awards (grant/revoke)
  - Users (role management)
  - Site content (home hero + home sections)
- Site content management from admin:
  - edit existing sections
  - add new section from selector ("Add new")
  - delete/reset sections to stock defaults
  - manage per-section cards (heading/subheading/body)
- Dynamic custom section routes (e.g. `/test`) rendered from admin-defined section data
- Styled confirmation dialogs (instead of browser-native confirm) for destructive actions
- 404 page
- Theme and language settings in profile
- Animated page/card transitions
- Scroll-to-top button
- Local state persistence (theme/language/profile data)
- Persistent admin session in local storage

## Requirements

- Node.js 18+
- npm 9+

## Run Locally

1. Install dependencies:

```bash
npm install --include=dev
```

2. Start development server:

```bash
npm run dev
```

3. Open the URL from terminal (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
```

Build output is generated in `dist/`.

## Project Structure

- `src/pages/` - route pages (`AuthPage`, `HomePage`, `ProfilePage`, club subpages, etc.)
- `src/router/index.js` - app routes
- `src/state/AppStore.js` - app state (user, theme, language, UI state)
- `src/styles/index.css` - style entrypoint
- `src/styles/core/` - base/global styles
- `src/styles/components/` - component styles (`header.css`, `toasts.css`, `profile-sidebar.css`, etc.)
- `src/styles/pages/` - page styles (`auth.css`, `home.css`, `detail.css`, `profile.css`)
- `src/styles/responsive/` - responsive styles
- `src/assets/` - local assets (`flag.png`, `logowithoutback.png`)
- `public/` - static public files (`ustav.docx`)

## Known Limitations

- The home slider currently uses one local image (`src/assets/flag.png`) for all slides.
- The project does not include a backend/API yet; profile/auth state is stored locally.
- Admin actions are currently local/demo scope (state persistence only; no server-side RBAC).
- Some textual content and contact data are demo placeholders.
