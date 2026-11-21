import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { fullName, email, password, confirmPassword } = formData;

    // Frontend validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your college email.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email format.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter carefully.');
      return;
    }

    // Demo notification (no real auth / DB)
    setSuccessMessage(
      `Frontend validation passed for ${fullName} (${email})! (Notice: Backend account creation has not been implemented yet).`
    );
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-circle">
            <UserPlus size={26} />
          </div>
          <h1 className="auth-title">Create Student Account</h1>
          <p className="auth-subtitle">
            Join the NITJ student marketplace to buy and sell campus items
          </p>
        </div>

        {/* Demo Warning Banner */}
        <div className="demo-notice-banner">
          <ShieldCheck size={16} />
          <span>
            <strong>Phase 2 Demo:</strong> Real account creation is not connected.
            Form validates inputs on the frontend.
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

        {/* Registration Form */}
        <form onSubmit={handleRegisterSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="reg-fullname" className="form-label">
              Full Name
            </label>
            <div className="input-with-icon">
              <User size={17} className="field-icon" />
              <input
                id="reg-fullname"
                name="fullName"
                type="text"
                className="form-input"
                placeholder="e.g. Rohan Gupta"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">
              College Email ID
            </label>
            <div className="input-with-icon">
              <Mail size={17} className="field-icon" />
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="e.g. rohan.me.22@nitj.ac.in"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            <span className="field-hint">Only students with valid college email can list</span>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={17} className="field-icon" />
              <input
                id="reg-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Create password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm-password" className="form-label">
              Confirm Password
            </label>
            <div className="input-with-icon">
              <Lock size={17} className="field-icon" />
              <input
                id="reg-confirm-password"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="btn-curved-black auth-submit-btn">
            <UserPlus size={17} />
            <span>Register Account</span>
          </button>
        </form>

        {/* Switch to Login */}
        <div className="auth-footer">
          <p className="auth-switch-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-switch-link">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
