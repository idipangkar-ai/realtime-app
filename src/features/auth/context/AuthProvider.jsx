import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getSession, loginUser, logoutUser } from '../api/auth';
import {
  clearSession,
  readSession,
  saveSession,
} from '../../../services/storage/session';
import {
  setApiSession,
  setSessionExpiredHandler,
} from '../../../services/frappe/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [booting, setBooting] = useState(true);
  const [bootError, setBootError] = useState('');
  const [notice, setNotice] = useState('');

  const expireSession = useCallback(() => {
    setApiSession(null);
    setSession(null);
    setNotice('Your session expired. Please sign in again.');
    clearSession().catch(() => {});
  }, []);

  const bootstrap = useCallback(async () => {
    setBooting(true);
    setBootError('');
    try {
      const saved = await readSession();
      if (saved) {
        setApiSession(saved);
        try {
          const current = await getSession();
          setApiSession(current);
          setSession(current);
        } catch (error) {
          if (error.sessionExpired || error.status === 403) {
            expireSession();
          } else {
            setBootError(error.message);
          }
        }
      }
    } catch (error) {
      setBootError(`Could not restore your secure session. ${error.message}`);
    } finally {
      setBooting(false);
    }
  }, [expireSession]);

  useEffect(() => {
    setSessionExpiredHandler(expireSession);
    bootstrap();
    return () => setSessionExpiredHandler(null);
  }, [bootstrap, expireSession]);

  async function signIn(username, password) {
    const current = await loginUser(username, password);
    setApiSession(current);
    try {
      await saveSession(current);
    } catch {
      await logoutUser().catch(() => {});
      setApiSession(null);
      throw new Error(
        'Could not securely save your session. Please try again.',
      );
    }
    setNotice('');
    setSession(current);
  }

  async function signOut() {
    try {
      await logoutUser();
    } finally {
      setApiSession(null);
      setSession(null);
      setBootError('');
      await clearSession();
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user,
        booting,
        bootError,
        notice,
        signIn,
        signOut,
        retry: bootstrap,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
