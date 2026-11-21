import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Guards routes that require authenticated student access (e.g. /sell, /my-listings).
 * 
 * Behaviors:
 * 1. While auth state is initializing (loading = true), displays a simple loading indicator.
 * 2. If user is unauthenticated (user = null), redirects to /login, saving current location.
 * 3. If user is authenticated, renders the protected child component.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading-container" role="status" aria-live="polite">
        <div className="auth-loading-spinner" />
        <p className="auth-loading-text">Verifying authentication status...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and preserve the intended route in location.state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
