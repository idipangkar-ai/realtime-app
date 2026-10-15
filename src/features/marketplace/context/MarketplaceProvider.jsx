import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import { useAuth } from '../../auth';
import {
  loadMarketplace,
  placeOrder,
  updateOrderStatus,
} from '../api/marketplace';
import { createRealtimeClient } from '../../../services/realtime/client';
import { getApiSession } from '../../../services/frappe/client';

const MarketplaceContext = createContext(null);
const emptyData = {
  products: [],
  buyerOrders: [],
  sellerOrders: [],
  context: null,
};

export function MarketplaceProvider({ children }) {
  const { session } = useAuth();
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connection, setConnection] = useState('offline');
  const [connectionError, setConnectionError] = useState('');
  const [events, setEvents] = useState([]);
  const pendingRefresh = useRef(null);
  const socketRef = useRef(null);

  const refresh = useCallback(() => {
    const sid = session?.sid;
    if (!sid || getApiSession()?.sid !== sid) return Promise.resolve();
    if (pendingRefresh.current?.sid === sid) {
      pendingRefresh.current.dirty = true;
      return pendingRefresh.current.promise;
    }
    const task = { sid, dirty: false };
    pendingRefresh.current = task;
    task.promise = (async () => {
      setLoading(true);
      try {
        do {
          task.dirty = false;
          const next = await loadMarketplace();
          if (getApiSession()?.sid !== sid) return;
          setData(next);
          setError('');
        } while (task.dirty && getApiSession()?.sid === sid);
      } catch (failure) {
        if (getApiSession()?.sid === sid) setError(failure.message);
        throw failure;
      } finally {
        if (pendingRefresh.current === task) {
          pendingRefresh.current = null;
          setLoading(false);
        }
      }
    })();
    return task.promise;
  }, [session?.sid]);

  useEffect(() => {
    setData(emptyData);
    setError('');
    setEvents([]);
    setConnectionError('');
    if (!session?.sid) {
      setConnection('offline');
      setLoading(false);
      return;
    }
    let active = true;
    const socket = createRealtimeClient(session);
    socketRef.current = socket;
    setConnection('connecting');
    const reload = () => {
      if (active) refresh().catch(() => {});
    };
    const onConnect = () => {
      if (!active) return;
      setConnection('connected');
      setConnectionError('');
      reload(); // Catch up on events missed while the app was disconnected.
    };
    const onDisconnect = () => {
      if (active) setConnection('reconnecting');
    };
    const onError = failure => {
      if (!active) return;
      setConnection('error');
      setConnectionError(failure.message || 'Realtime connection failed.');
    };
    const onEvent = type => payload => {
      if (!active) return;
      setEvents(previous =>
        [{ type, ...payload, receivedAt: Date.now() }, ...previous].slice(
          0,
          20,
        ),
      );
      reload();
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onError);
    socket.on('marketplace_new_order', onEvent('marketplace_new_order'));
    socket.on(
      'marketplace_order_updated',
      onEvent('marketplace_order_updated'),
    );
    socket.connect();
    reload();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        if (!socket.connected) socket.connect();
        reload();
      }
    });
    return () => {
      active = false;
      subscription.remove();
      socket.removeAllListeners();
      socket.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [session?.sid, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  async function orderProduct(product, quantity) {
    const result = await placeOrder(product, quantity);
    refresh().catch(() => {});
    return result;
  }

  async function changeOrderStatus(order, status) {
    const result = await updateOrderStatus(order, status);
    refresh().catch(() => {});
    return result;
  }

  function reconnect() {
    socketRef.current?.disconnect();
    socketRef.current?.connect();
    refresh().catch(() => {});
  }

  return (
    <MarketplaceContext.Provider
      value={{
        ...data,
        loading,
        error,
        connection,
        connectionError,
        events,
        refresh,
        reconnect,
        orderProduct,
        changeOrderStatus,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  return useContext(MarketplaceContext);
}
