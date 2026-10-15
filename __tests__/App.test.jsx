import React from 'react';
import { Text, TextInput } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import * as Keychain from 'react-native-keychain';
import App from '../App';
import { Button } from '../src/shared/components/Button';
import { setApiSession } from '../src/services/frappe/client';

jest.mock('../src/services/realtime/client', () => ({
  createRealtimeClient: () => ({
    on: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    removeAllListeners: jest.fn(),
  }),
}));

const session = {
  sid: 'test-session-only',
  csrf_token: 'test-csrf',
  user: {
    name: 'buyer@example.test',
    full_name: 'Test Buyer',
    email: 'buyer@example.test',
    roles: ['Customer'],
    user_type: 'Website User',
  },
  summary: { total_products: 0 },
};
let renderer;

beforeEach(() => {
  setApiSession(null);
  jest.clearAllMocks();
  Keychain.getGenericPassword.mockResolvedValue(false);
  global.fetch = jest.fn(async url => ({
    ok: true,
    status: 200,
    json: async () => ({
      message: url.endsWith('/login')
        ? 'Logged In'
        : url.endsWith('get_session')
        ? session
        : url.endsWith('get_dashboard_context')
        ? { user: session.user, summary: session.summary }
        : [],
    }),
  }));
});

afterEach(async () => {
  if (renderer) await act(() => renderer.unmount());
  renderer = null;
  setApiSession(null);
});

test('a fresh app opens Login and validates empty fields without a request', async () => {
  await act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(
    renderer.root
      .findAllByType(TextInput)
      .map(node => node.props.accessibilityLabel),
  ).toEqual(['Email or username', 'Password']);
  await act(async () => {
    await renderer.root.findByType(Button).props.onPress();
  });
  expect(
    renderer.root
      .findAllByType(Text)
      .some(
        node =>
          node.props.children === 'Enter your email or username and password.',
      ),
  ).toBe(true);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('login opens the authenticated feed and four tabs, storing the session without the password', async () => {
  await act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await act(async () => {
    renderer.root
      .findAllByType(TextInput)[0]
      .props.onChangeText('buyer@example.test');
    renderer.root
      .findAllByType(TextInput)[1]
      .props.onChangeText('test-only-password');
  });
  await act(async () => {
    await renderer.root.findByType(Button).props.onPress();
  });
  expect(
    renderer.root
      .findAllByType(Text)
      .some(node => node.props.children === 'Available products'),
  ).toBe(true);
  for (const name of ['Home', 'Profile', 'Orders', 'More']) {
    expect(
      renderer.root.findAll(
        node => node.props.accessibilityLabel === `${name} tab`,
      ).length,
    ).toBeGreaterThan(0);
  }
  const stored = JSON.parse(Keychain.setGenericPassword.mock.calls[0][1]);
  expect(stored.sid).toBe(session.sid);
  expect(JSON.stringify(stored)).not.toContain('test-only-password');
});

test('a temporary outage restoring a saved session offers Retry and preserves secure storage', async () => {
  Keychain.getGenericPassword.mockResolvedValue({
    password: JSON.stringify({
      sid: session.sid,
      baseUrl: 'http://127.0.0.1:8000',
    }),
  });
  global.fetch.mockRejectedValue(new TypeError('Network request failed'));
  await act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(
    renderer.root
      .findAllByType(Button)
      .some(node => node.props.title === 'Retry connection'),
  ).toBe(true);
  expect(Keychain.resetGenericPassword).not.toHaveBeenCalled();
});
