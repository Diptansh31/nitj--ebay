import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from '../services/authService';

/**
 * React Context for Supabase Authentication
 */
const AuthContext = createContext(null);

/**
 * AuthProvider component to wrap the application and broadcast auth state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial session check on mount (restores session after browser refresh)
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession }, error }) => {
        if (!isMounted) return;

        if (error) {
          console.error('Error fetching initial auth session:', error.message);
        }

        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Session retrieval error:', err);
          setLoading(false);
        }
      });

    // 2. Listen to authentication state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED)
    // Avoids redundant calls by updating state directly from the event payload
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    });

    // 3. Clean up the listener when the provider unmounts
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to easily consume the AuthContext
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
