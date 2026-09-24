import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, clearToken, setOnUnauthorized } from './api';
import { TOKEN_KEY } from './config';
import type { UserResponseDTO } from '../types';
import { useToast } from '../components/Toast';

interface AuthContextValue {
  token: string | null;
  user: UserResponseDTO | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  // Token as it was at first render. Child effects (e.g. OAuthCallback) run before this
  // provider's effects, so reading localStorage inside the effect could pick up a token
  // that login() has only just saved and trigger a duplicate profile request.
  const initialToken = useRef(token);
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
    setUser(null);
  }, []);

  // Wire up 401 handler. A 401 while browsing (typically an expired token) should
  // drop the user back to guest mode gracefully — clear their session, let them know
  // why, and send them to log back in — instead of leaving the app in a half-authed
  // state that behaves unpredictably.
  useEffect(() => {
    setOnUnauthorized(() => {
      const wasAuthenticated = !!localStorage.getItem(TOKEN_KEY);
      logout();
      if (wasAuthenticated) {
        toast('Your session has expired. Please log in again.', 'info');
        navigate('/login', { replace: true });
      }
    });
  }, [logout, navigate, toast]);

  // Restore an existing session once on first load / page refresh.
  // (login() below loads the profile itself, so this must NOT re-run on every token change.)
  useEffect(() => {
    if (!initialToken.current) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    authApi
      .getCurrentUser()
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [logout]);

  // Saves the token, loads the profile, then updates global state in one go, so the
  // navbar switches to the profile view immediately and never flashes "Login / Register".
  // Rejects (and clears the token) if the profile can't be loaded, so callers can show an error.
  const login = useCallback(async (newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    try {
      const data = await authApi.getCurrentUser();
      setUser(data);
      setToken(newToken);
      setLoading(false);
    } catch (err) {
      clearToken();
      setToken(null);
      setUser(null);
      throw err;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const data = await authApi.getCurrentUser();
      setUser(data);
    } catch {
      // ignore
    }
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
      refreshUser,
    }),
    [token, user, loading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
