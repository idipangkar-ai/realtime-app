# Services

Put app-wide external integrations here, such as an HTTP client, secure storage,
analytics, notifications, or a WebSocket connection. Create a directory per
integration when implemented, for example `http/client.js`.

Services may import `config` and non-UI shared utilities. They must not import
features, screens, or app providers. Feature-specific endpoints and response
mapping belong in `features/<feature>/api`, using these shared clients.

Keep credentials on a backend. Values bundled into a mobile app are public.
