# RealTime

React Native application using JavaScript and JSX, organized by feature.

## Development

Requirements: Node.js 22.11 or newer, JDK 17, and an Android SDK configured
through `ANDROID_HOME`. Connect an Android device with USB debugging enabled.

From `C:\Forrce\RealTime`:

```powershell
npm ci
npm start
```

Keep Metro running. In another terminal at the project root:

```powershell
npm run android -- --active-arch-only
```

The first Android build downloads Gradle, Maven dependencies, and missing SDK
packages. The Gradle wrapper allows a 120-second download timeout. For a physical
USB device, if the app cannot reach Metro, run `adb reverse tcp:8081 tcp:8081`.

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
The services, config, and assets folders contain guidance until implementations
are needed.

## Checks

```powershell
npm run lint
npm test -- --runInBand
```

## Current screens

- Home: a scrollable, two-column feed with six bundled demo products and category filters.
- Profile, Orders, More: empty screens connected to the bottom tabs.
- Search and Chat: empty stack screens with back navigation.
- Hamburger menu: a dismissible drawer with links to all four tabs.

Navigation is composed in `src/app/navigation/RootNavigator.jsx`. Demo products
live in `src/features/feed/data/products.js`. Shared colors live in
`src/shared/theme/theme.js`.
