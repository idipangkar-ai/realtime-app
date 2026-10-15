# RealTime

React Native application using JavaScript and JSX, organized by feature.

## Development

Requirements: Node.js 22.11 or newer, JDK 17, and an Android SDK configured
through `ANDROID_HOME`. Connect an Android device with USB debugging enabled.

From `C:\Forrce\RealTime`:

```powershell
npm ci
npm run device
npm start
```

Keep Metro running. In another terminal at the project root:

```powershell
npm run android -- --active-arch-only --no-packager
```

Keep the Frappe bench running in WSL. `npm run device` connects the USB phone
to Metro, Frappe HTTP, and Frappe Socket.IO. Re-run it after reconnecting USB.
The first build downloads missing Android dependencies.

Connection settings live in `src/config/frappe.js`. Read the
[phase-one setup and manual test guide](docs/phase-one-testing.md) for backend
setup, independent buyer/seller sessions, and troubleshooting.

For iOS, use macOS with Xcode, run `bundle install` at the root and
`bundle exec pod install` inside `ios`, then run `npm run ios` from the root.

## Project structure

```text
src/
  app/          App composition and global providers
  features/     Features that own their screens, behavior, API calls, and models
  shared/       Components and utilities used across features
  services/     Shared API clients, storage, and other external integrations
  config/       Public environment settings and feature flags
  assets/       Shared images, fonts, and static files
```

Start editing the product feed in
`src/features/feed/screens/FeedScreen.jsx`. The root `App.jsx` forwards to
`src/app/App.jsx`; native registration stays in `index.js`.

Read [the architecture guide](docs/architecture.md) for dependency rules,
feature templates, naming, state ownership, and where future integrations belong.
Authentication and marketplace providers handle sessions and server data;
screens consume those providers rather than making network calls directly.

## Checks

```powershell
npm run lint
npm test -- --runInBand
```

## Current screens

- Splash and Login: restore a secure session or sign in with your Frappe account.
- Home: live Frappe products in two columns, category filters, and quantity-based ordering.
- Profile: Frappe identity, roles, summary, and sign out.
- Orders: buyer purchases, seller inbox, and live order-status updates.
- More: connection diagnostics, reconnect, and the latest live events.
- Search and Chat: empty stack screens with back navigation.
- Hamburger menu: a dismissible drawer with links to all four tabs.

Navigation is composed in `src/app/navigation/RootNavigator.jsx`. Frappe product
and order methods live in `src/features/marketplace/api/marketplace.js`.
Shared colors live in `src/shared/theme/theme.js`.
