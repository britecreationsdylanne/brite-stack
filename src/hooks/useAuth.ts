import { useState, useEffect } from 'react';

// Define user type for server-side auth
interface AuthUser {
  email: string;
  name: string;
  picture: string;
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

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for server-injected user
    if (window.AUTH_USER) {
      // Set BritePulse user FIRST before any other operations
      setBritePulseUser(window.AUTH_USER);

      setUser({
        ...window.AUTH_USER,
        displayName: window.AUTH_USER.name  // Add displayName alias
      });
    }
    setLoading(false);
  }, []);

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

  return { user, loading, signInWithGoogle, logout };
}
