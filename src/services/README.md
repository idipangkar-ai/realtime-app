# Services

- `frappe/client.js`: HTTP requests, session/CSRF headers, safe error messages,
  timeouts, and session-expiry notifications.
- `realtime/client.js`: an authenticated Socket.IO client for each session.
- `storage/session.js`: Keychain-backed sessions; passwords are never saved.

Put app-wide external integrations here, such as an HTTP client, secure storage,
analytics, notifications, or a WebSocket connection. Create a directory per
integration when implemented, for example `http/client.js`.

Services may import `config` and non-UI shared utilities. They must not import
features, screens, or app providers. Feature-specific endpoints and response
mapping belong in `features/<feature>/api`, using these shared clients.

Keep credentials on a backend. Values bundled into a mobile app are public.
