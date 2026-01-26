import { useState, useEffect } from 'react';

// Define user type for server-side auth
interface AuthUser {
  email: string;
  name: string;
  picture: string;
  displayName?: string;  // Alias for name for compatibility
}

// Extend Window interface for AUTH_USER
declare global {
  interface Window {
    AUTH_USER?: {
      email: string;
      name: string;
      picture: string;
    };
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for server-injected user
    if (window.AUTH_USER) {
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
    // Redirect to server logout endpoint
    window.location.href = '/auth/logout';
  };

  return { user, loading, signInWithGoogle, logout };
}
