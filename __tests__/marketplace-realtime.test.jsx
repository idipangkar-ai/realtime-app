import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import {
  MarketplaceProvider,
  useMarketplace,
} from '../src/features/marketplace';
import { loadMarketplace } from '../src/features/marketplace/api/marketplace';
import { createRealtimeClient } from '../src/services/realtime/client';
import { setApiSession } from '../src/services/frappe/client';

jest.mock('../src/features/auth', () => ({
  useAuth: () => ({
    session: { sid: 'test-session', user: { name: 'buyer@example.test' } },
  }),
}));
jest.mock('../src/features/marketplace/api/marketplace', () => ({
  loadMarketplace: jest.fn(),
  placeOrder: jest.fn(),
  updateOrderStatus: jest.fn(),
}));
jest.mock('../src/services/realtime/client', () => ({
  createRealtimeClient: jest.fn(),
}));

let current;
let renderer;
let handlers;
let socket;
const seed = {
  context: { user: { name: 'buyer@example.test' } },
  products: [],
  sellerOrders: [],
  buyerOrders: [{ name: 'ORDER-TEST', order_status: 'Placed' }],
};

function Probe() {
  current = useMarketplace();
  return null;
}

beforeEach(() => {
  jest.clearAllMocks();
  handlers = {};
  socket = {
    on: jest.fn((name, callback) => {
      handlers[name] = callback;
    }),
    connect: jest.fn(() => handlers.connect?.()),
    disconnect: jest.fn(),
    removeAllListeners: jest.fn(),
    connected: true,
  };
  createRealtimeClient.mockReturnValue(socket);
  loadMarketplace.mockResolvedValue(seed);
  setApiSession({ sid: 'test-session' });
});

afterEach(async () => {
  if (renderer) await act(() => renderer.unmount());
  renderer = null;
  setApiSession(null);
});

test('a received order event refreshes buyer statuses and records the live event', async () => {
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <MarketplaceProvider>
        <Probe />
      </MarketplaceProvider>,
    );
  });
  expect(current.connection).toBe('connected');
  loadMarketplace.mockResolvedValue({
    ...seed,
    buyerOrders: [{ name: 'ORDER-TEST', order_status: 'Packing' }],
  });
  await act(async () => {
    handlers.marketplace_order_updated({
      order: 'ORDER-TEST',
      status: 'Packing',
    });
  });
  expect(current.buyerOrders[0].order_status).toBe('Packing');
  expect(current.events[0]).toMatchObject({
    type: 'marketplace_order_updated',
    order: 'ORDER-TEST',
    status: 'Packing',
  });
});

test('reconnecting catches up on order changes missed while offline', async () => {
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <MarketplaceProvider>
        <Probe />
      </MarketplaceProvider>,
    );
  });
  await act(async () => {
    handlers.disconnect();
  });
  expect(current.connection).toBe('reconnecting');
  loadMarketplace.mockResolvedValue({
    ...seed,
    buyerOrders: [{ name: 'ORDER-TEST', order_status: 'Delivered' }],
  });
  await act(async () => {
    handlers.connect();
  });
  expect(current.buyerOrders[0].order_status).toBe('Delivered');
  expect(current.connection).toBe('connected');
});

test('unmount disconnects the socket and removes listeners', async () => {
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <MarketplaceProvider>
        <Probe />
      </MarketplaceProvider>,
    );
  });
  await act(() => renderer.unmount());
  renderer = null;
  expect(socket.removeAllListeners).toHaveBeenCalled();
  expect(socket.disconnect).toHaveBeenCalled();
});
