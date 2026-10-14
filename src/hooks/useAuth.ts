import { useState, useEffect, useCallback } from 'react';

export type Role = 'user' | 'admin';

// Define user type for server-side auth
export interface AuthUser {
  email: string;
  name: string;
  picture: string;
  role: Role;
  displayName?: string;  // Alias for name for compatibility
}

// Extend Window interface for AUTH_USER and BritePulse
declare global {
  interface Window {
    AUTH_USER?: {
      email: string;
      name: string;
      picture: string;
    };
    BritePulse?: {
      getInstance: () => {
        setUser: (user: { id: string; email: string; name: string } | undefined) => void;
      } | null;
    };
  }
}

// BritePulse user identification helpers
function setBritePulseUser(user: { email: string; name: string }) {
  function trySetUser() {
    const instance = window.BritePulse?.getInstance();
    if (instance) {
      instance.setUser({
        id: user.email,
        email: user.email,
        name: user.name || user.email
      });
      console.log('BritePulse user set:', user.email);
    } else {
      // SDK not ready yet, retry
      setTimeout(trySetUser, 100);
    }
  }
  trySetUser();
}

function clearBritePulseUser() {
  window.BritePulse?.getInstance()?.setUser(undefined);
}

interface MeResponse {
  authenticated: boolean;
  disabled?: boolean;
  user?: { email: string; name: string; picture: string; role?: Role };
  hidden_tools?: string[];
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hiddenTools, setHiddenTools] = useState<Set<string>>(new Set());
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/me', { credentials: 'same-origin' });
      if (res.status === 401) {
        setUser(null);
        return;
      }
      const data: MeResponse = await res.json();
      if (res.status === 403 && data.disabled) {
        // Signed in, but an admin switched this person's BriteStack access off
        setDisabled(true);
        setUser(data.user ? { ...data.user, role: 'user', displayName: data.user.name } : null);
        return;
      }
      if (data.authenticated && data.user) {
        setBritePulseUser(data.user);
        setUser({ ...data.user, role: data.user.role ?? 'user', displayName: data.user.name });
        setHiddenTools(new Set(data.hidden_tools ?? []));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error loading /api/me:', err);
      // Fall back to the server-injected user so the dashboard still renders
      if (window.AUTH_USER) {
        setUser({ ...window.AUTH_USER, role: 'user', displayName: window.AUTH_USER.name });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signInWithGoogle = () => {
    // Redirect to server OAuth endpoint
    window.location.href = '/auth/login';
  };

  const logout = () => {
    // Clear BritePulse user before logout
    clearBritePulseUser();
    // Redirect to server logout endpoint
    window.location.href = '/auth/logout';
  };

  return { user, hiddenTools, disabled, loading, signInWithGoogle, logout, refresh };
}
