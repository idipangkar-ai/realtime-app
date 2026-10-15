import { io } from 'socket.io-client';
import { frappeConfig } from '../../config/frappe';

export function createRealtimeClient(session) {
  return io(`${frappeConfig.realtimeUrl}/${frappeConfig.site}`, {
    path: '/socket.io',
    autoConnect: false,
    forceNew: true,
    transports: ['websocket'],
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    timeout: 10000,
    extraHeaders: {
      Cookie: `sid=${session.sid}`,
      Origin: frappeConfig.baseUrl,
      'X-Frappe-Site-Name': frappeConfig.site,
    },
  });
}
