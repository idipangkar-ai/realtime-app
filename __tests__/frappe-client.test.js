import {
  frappeRequest,
  parseFrappeError,
  setApiSession,
  setSessionExpiredHandler,
} from '../src/services/frappe/client';

afterEach(() => {
  setApiSession(null);
  setSessionExpiredHandler(null);
});

test('authenticated writes carry the caller session and CSRF token', async () => {
  setApiSession({ sid: 'test-sid', csrf_token: 'test-csrf' });
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({ message: { order: 'ORDER-TEST' } }),
  }));
  await frappeRequest('/test', { method: 'POST', body: { quantity: 2 } });
  expect(global.fetch.mock.calls[0][1]).toMatchObject({
    headers: { Cookie: 'sid=test-sid', 'X-Frappe-CSRF-Token': 'test-csrf' },
    body: '{"quantity":2}',
  });
});

test('seller permission errors do not sign out a valid buyer', async () => {
  const expired = jest.fn();
  setApiSession({ sid: 'buyer-session' });
  setSessionExpiredHandler(expired);
  global.fetch = jest.fn(async () => ({
    ok: false,
    status: 403,
    json: async () => ({
      exc_type: 'PermissionError',
      message: 'Only the assigned seller can update this order.',
    }),
  }));
  await expect(frappeRequest('/test')).rejects.toThrow(
    'Only the assigned seller',
  );
  expect(expired).not.toHaveBeenCalled();
});

test('expired sessions notify the auth layer', async () => {
  const expired = jest.fn();
  setApiSession({ sid: 'expired-session' });
  setSessionExpiredHandler(expired);
  global.fetch = jest.fn(async () => ({
    ok: false,
    status: 403,
    json: async () => ({
      exc_type: 'PermissionError',
      message: 'Please log in to continue.',
    }),
  }));
  await expect(frappeRequest('/test')).rejects.toThrow('Please log in');
  expect(expired).toHaveBeenCalledTimes(1);
});

test('an old account response cannot invalidate a newer account session', async () => {
  const expired = jest.fn();
  let complete;
  setApiSession({ sid: 'old-account' });
  setSessionExpiredHandler(expired);
  global.fetch = jest.fn(
    () =>
      new Promise(resolve => {
        complete = resolve;
      }),
  );
  const pending = frappeRequest('/test');
  setApiSession({ sid: 'new-account' });
  complete({
    ok: false,
    status: 401,
    json: async () => ({ message: 'Session expired' }),
  });
  await expect(pending).rejects.toThrow('Session expired');
  expect(expired).not.toHaveBeenCalled();
});

test('Frappe messages are readable and never expose the traceback', () => {
  expect(
    parseFrappeError({
      _server_messages: JSON.stringify([
        JSON.stringify({ message: '<b>Insufficient stock.</b>' }),
      ]),
      exc: 'private traceback',
    }),
  ).toBe('Insufficient stock.');
});
