import { loginUser } from '../src/features/auth/api/auth';
import { frappeRequest } from '../src/services/frappe/client';

jest.mock('../src/services/frappe/client', () => ({
  frappeRequest: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

test.each(['No App', 'Logged In'])(
  '%s is a successful login and must verify the authenticated session',
  async message => {
    const session = {
      sid: 'test-session',
      csrf_token: 'test-csrf',
      user: { name: 'buyer@example.test' },
    };
    frappeRequest.mockResolvedValueOnce(message).mockResolvedValueOnce(session);
    await expect(
      loginUser('buyer@example.test', 'test-password'),
    ).resolves.toEqual(session);
    expect(frappeRequest).toHaveBeenLastCalledWith(
      '/api/method/realtime_marketplace.api.mobile.get_session',
    );
  },
);

test('password reset is distinguished from a two-factor challenge', async () => {
  frappeRequest.mockResolvedValueOnce('Password Reset');
  await expect(
    loginUser('buyer@example.test', 'test-password'),
  ).rejects.toThrow('password reset');
  expect(frappeRequest).toHaveBeenCalledTimes(1);
});

test('an incomplete login is not accepted as an authenticated session', async () => {
  frappeRequest.mockResolvedValueOnce(undefined);
  await expect(
    loginUser('buyer@example.test', 'test-password'),
  ).rejects.toThrow('did not complete sign-in');
  expect(frappeRequest).toHaveBeenCalledTimes(1);
});
