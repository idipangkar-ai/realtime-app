import { frappeRequest } from '../../../services/frappe/client';

export async function loginUser(username, password) {
  const result = await frappeRequest('/api/method/login', {
    method: 'POST',
    body: { usr: username.trim(), pwd: password },
  });
  // Frappe returns "No App" for a successful Website User login. It means
  // the user has no Desk access, not that authentication failed.
  if (result !== 'Logged In' && result !== 'No App') {
    throw new Error(
      result === 'Password Reset'
        ? 'Frappe requires a password reset. Reset your password in the web app, then sign in again.'
        : 'Frappe did not complete sign-in. Check whether your account requires two-factor authentication.',
    );
  }
  // Native networking receives the HttpOnly login cookie. The authenticated
  // endpoint exposes only this session so it can also authenticate Socket.IO.
  return getSession();
}

export async function getSession() {
  const current = await frappeRequest(
    '/api/method/realtime_marketplace.api.mobile.get_session',
  );
  if (
    !current?.sid ||
    current.sid === 'Guest' ||
    !current.user?.name ||
    !current.csrf_token
  ) {
    throw new Error(
      'Frappe did not return a valid mobile session. Check that the mobile integration endpoint is installed.',
    );
  }
  return current;
}

export function logoutUser() {
  return frappeRequest('/api/method/logout', { method: 'POST' });
}
