import { frappeConfig } from '../../config/frappe';

let session = null;
let onSessionExpired = null;

export function setApiSession(value) {
  session = value;
}

export function getApiSession() {
  return session;
}

export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

export function parseFrappeError(data) {
  let message = typeof data.message === 'string' ? data.message : '';
  if (data._server_messages) {
    try {
      const [first] = JSON.parse(data._server_messages);
      message = JSON.parse(first).message || message;
    } catch {
      // Keep the safe fallback; never render the server traceback.
    }
  }
  return String(message || 'The request could not be completed.')
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export async function frappeRequest(
  path,
  { method = 'GET', body, ...options } = {},
) {
  const requestSession = session;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    frappeConfig.requestTimeout,
  );
  try {
    const response = await fetch(`${frappeConfig.baseUrl}${path}`, {
      ...options,
      method,
      credentials: 'include',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Frappe-Site-Name': frappeConfig.site,
        ...(requestSession?.sid ? { Cookie: `sid=${requestSession.sid}` } : {}),
        ...(requestSession?.csrf_token
          ? { 'X-Frappe-CSRF-Token': requestSession.csrf_token }
          : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.exc_type || data.exc) {
      const error = new Error(parseFrappeError(data));
      error.status = response.status;
      error.sessionExpired =
        response.status === 401 ||
        data.exc_type === 'AuthenticationError' ||
        (response.status === 403 &&
          /log\s?in|not logged|session expired/i.test(error.message));
      if (
        requestSession === session &&
        requestSession &&
        error.sessionExpired
      ) {
        onSessionExpired?.();
      }
      throw error;
    }
    return data.message;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(
        'The server took too long to respond. Check your connection and try again.',
      );
    }
    if (error instanceof TypeError) {
      throw new Error(
        'Cannot reach Frappe. Check the server and USB connection, then retry.',
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
