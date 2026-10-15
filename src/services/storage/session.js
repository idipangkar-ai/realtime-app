import * as Keychain from 'react-native-keychain';
import { frappeConfig } from '../../config/frappe';

const options = { service: `realtime.frappe.${frappeConfig.site}` };

export async function readSession() {
  const stored = await Keychain.getGenericPassword(options);
  if (!stored) return null;
  try {
    const value = JSON.parse(stored.password);
    // A session belongs to one server/site; never replay it against another.
    return value.baseUrl === frappeConfig.baseUrl && value.sid
      ? { sid: value.sid }
      : null;
  } catch {
    await clearSession();
    return null;
  }
}

export async function saveSession(value) {
  await Keychain.setGenericPassword(
    'frappe-session',
    JSON.stringify({
      sid: value.sid,
      baseUrl: frappeConfig.baseUrl,
    }),
    {
      ...options,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    },
  );
}

export function clearSession() {
  return Keychain.resetGenericPassword(options);
}
