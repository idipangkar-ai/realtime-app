# App architecture

The app uses feature-based organization. Keep code close to the behavior it
supports and extract shared code when it is reused. The feed owns the demo
catalog; the other features currently provide empty navigation destinations.

## Directory map

```text
App.jsx                         Stable root export
index.js                        Native app registration
src/
  app/
    App.jsx                     App composition and global status bar
    navigation/                 Root stack, bottom tabs, and menu drawer
    providers/AppProviders.jsx  App-wide provider composition
  features/
    feed/
      index.js                  Feature's public exports
      screens/FeedScreen.jsx    Feed feature entry screen
      components/               Product cards
      data/products.js          Demo catalog and category definitions
    chat/                       Empty Chat destination
    search/                     Empty Search destination
    profile/                    Empty Profile tab
    orders/                     Empty Orders tab
    more/                       Empty More tab
  shared/
    components/Screen.jsx       Reusable screen layout
    components/                 Shared header, icon buttons, and SVG icons
    theme/theme.js              Shared color palette
  services/                     Shared external integrations
  config/                       Public environment settings and flags
  assets/                       Shared bundled assets
docs/                           Architecture and development notes
__tests__/                      App-level integration/smoke tests
android/                        Android native project
ios/                            iOS native project
```

`services` and `config` currently contain placement guidance. Add implementations
when required by a feature. `assets/products` contains bundled demo photography.

## Dependency rules

- `app` composes feature entry points and global providers.
- `features` may use `shared`, `services`, and `config`.
- Import another feature only through its `index.js`, never its internals.
  Prefer composing independent features in `app` to avoid circular dependencies.
- `shared` must not depend on features or app composition.
- `services` must not depend on UI or features.
- `config` must not depend on app behavior.

These are architectural conventions, not automated lint restrictions. Use
relative imports for now; aliases would need matching Metro, editor, and
Jest configuration.

## Adding a feature

Create `src/features/<feature>/` and add only the folders it needs:

```text
features/<feature>/
  index.js          Public screens and helpers needed by other features
  screens/          Screen composition and route-level UI
  components/       UI private to this feature
  hooks/            Feature behavior and state
  api/              Endpoints and response-to-domain mapping
  models/           Feature domain models and data transformations
  __tests__/        Feature behavior tests
```

Use PascalCase for component filenames and camelCase for hooks and utilities.
Keep business logic out of screen rendering. Keep state local initially; move
it into a feature hook or store when multiple consumers require it. App-wide
state belongs in a dedicated provider when it crosses feature boundaries.

## Shared code and integrations

Add `shared/hooks`, `shared/utils`, `shared/models`, and `shared/theme` when there
is reusable code for them. Keep feature-specific models and constants inside
the owning feature. Introduce shared colors, spacing, and typography in
`shared/theme` for custom UI.

Add API transport and storage adapters in `services`; keep domain-specific
requests in each feature. Handle loading, empty, offline, and failure states
at the feature boundary. Avoid network calls directly inside UI components.

The root navigator lives in `app/navigation`, importing screens through feature
entry points. A native stack owns Search and Chat, and wraps the Home, Profile,
Orders, and More bottom tabs. The hamburger menu links to those same tab routes.
React Navigation manages back behavior and tab state. Local category-filter
state stays inside the feed. Add session and query-cache providers to
`AppProviders` as their dependencies are introduced.

## Verification

Run `npm run lint` and `npm test -- --runInBand` before
merging application changes. App-wide rendering tests stay in `__tests__`;
feature tests live next to the feature. Native changes also require an Android
or iOS build. Never put generated build output in `src` or commit it.
