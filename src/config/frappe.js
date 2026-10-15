// Android USB development: npm run device. These ports are reversed to Windows.
// For a deployed backend, replace both URLs with its HTTPS origin.
export const frappeConfig = {
  baseUrl: 'http://127.0.0.1:8000',
  realtimeUrl: 'http://127.0.0.1:9000',
  site: 'realtime.local',
  requestTimeout: 15000,
};
