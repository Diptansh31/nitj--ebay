import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Frontend validation
    if (!email.trim()) {
      setErrorMessage('Please enter your NITJ college email address.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email format (e.g. rollno@nitj.ac.in).');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // Demo notification (no real auth)
    setSuccessMessage(
      `Frontend form validation passed for ${email}! (Notice: Backend authentication has not been implemented yet).`
    );
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
            Sign in to access your student marketplace listings
          </p>
        </div>

        {/* Demo Warning Banner */}
        <div className="demo-notice-banner">
          <ShieldCheck size={16} />
          <span>
            <strong>Phase 2 Demo:</strong> Real authentication is not connected.
            Form validates locally on the frontend.
          </span>
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
              />
            </div>
            <span className="field-hint">Use your official NITJ email address</span>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <button
                type="button"
                className="forgot-link-btn"
                onClick={() =>
                  alert('Password recovery will be available in Phase 3.')
                }
              >
                Forgot password?
              </button>
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
              />
            </div>
          </div>

          <button type="submit" className="btn-curved-black auth-submit-btn">
            <LogIn size={17} />
            <span>Log In</span>
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
