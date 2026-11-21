import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to destination or home
  useEffect(() => {
    if (user) {
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedEmail = email.trim();

    // Frontend validation
    if (!trimmedEmail) {
      setErrorMessage('Please enter your NITJ college email address.');
      return;
    }

    if (!trimmedEmail.toLowerCase().endsWith('@nitj.ac.in')) {
      setErrorMessage('Please use your official @nitj.ac.in student email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await login({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }

      if (data?.session) {
        setSuccessMessage('Login successful! Redirecting...');
        const destination = location.state?.from?.pathname || '/';
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-circle">
            <LogIn size={26} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in with your NITJ credentials to access the student marketplace
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="auth-alert error-alert" role="alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="auth-alert success-alert" role="status">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              College Email ID
            </label>
            <div className="input-with-icon">
              <Mail size={17} className="field-icon" />
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="e.g. 21104045@nitj.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>
            <span className="field-hint">Use your official NITJ email address (@nitj.ac.in)</span>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
            </div>
            <div className="input-with-icon">
              <Lock size={17} className="field-icon" />
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-curved-black auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={17} className="spin-icon" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={17} />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="auth-footer">
          <p className="auth-switch-text">
            Don't have an account yet?{' '}
            <Link to="/register" className="auth-switch-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
