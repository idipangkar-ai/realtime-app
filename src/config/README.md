# Configuration

Keep environment selection, validated public settings, and feature flags here
when needed. Read and validate settings in one place instead of reading
environment variables throughout screens and services.

Do not commit secrets or assume a `.env` file makes values private. React Native
does not automatically load arbitrary `.env` files; wire up an explicit solution
when the app first needs environment-specific configuration.
