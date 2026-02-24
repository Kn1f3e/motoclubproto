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
- Home page with club sections
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
  - Settings
  - Notifications
- Theme switching (light/dark) in profile settings
- Language switching (RU / EN) in profile settings
- Animated page/card appearance transitions
- Scroll-to-top button
- Local state persistence (theme/language/profile data)

## Requirements

- Node.js 18+
- npm 9+

## Run Locally

1. Install dependencies:

```bash
npm install --include=dev
```

2. Start the development server:

```bash
npm run dev
```

3. Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
```

Build output is generated in `dist/`.

## Project Structure (main parts)

- `src/pages/` - route pages (`AuthPage`, `HomePage`, `ProfilePage`, club subpages, etc.)
- `src/router/index.js` - app routes
- `src/state/AppStore.js` - app state (user, theme, language, UI state)
- `src/styles.css` - global styles and animations
- `public/` - static assets (`ustav.docx`, images)
