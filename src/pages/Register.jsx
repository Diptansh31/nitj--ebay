import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isNitjEmail } from '../services/authService';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, register } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { fullName, email, password, confirmPassword } = formData;
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();

    // Frontend validation
    if (!trimmedFullName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage('Please enter your college email address.');
      return;
    }

    if (!isNitjEmail(trimmedEmail)) {
      setErrorMessage('Registrations are restricted to official @nitj.ac.in student emails.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter carefully.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await register({
        fullName: trimmedFullName,
        email: trimmedEmail,
        password,
        confirmPassword,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }

      // Successful registration
      setRegisteredEmail(trimmedEmail);
      setSuccessMessage(
        `Account registration submitted! A verification link has been sent to ${trimmedEmail}. Please check your inbox and verify your email to activate your account.`
      );

      // Reset sensitive form fields
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while creating your account.');
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
            <UserPlus size={26} />
          </div>
          <h1 className="auth-title">Create Student Account</h1>
          <p className="auth-subtitle">
            Join the NITJ student marketplace to buy and sell campus items
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
        {successMessage ? (
          <div className="auth-success-flow">
            <div className="auth-alert success-alert" role="status">
              <CheckCircle2 size={20} />
              <div>
                <strong>Verify your NITJ email</strong>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
                  {successMessage}
                </p>
              </div>
            </div>

            <div className="verification-instruction-box">
              <Mail size={22} className="mail-accent-icon" />
              <div>
                <h4>What to do next:</h4>
                <ol>
                  <li>Open your <strong>{registeredEmail}</strong> inbox.</li>
                  <li>Click the confirmation link in the email from Supabase / NITJ eBay.</li>
                  <li>Return to the login page and sign in with your credentials.</li>
                </ol>
              </div>
            </div>

            <Link to="/login" className="btn-curved-black full-width" style={{ marginTop: '1.25rem' }}>
              <span>Proceed to Login</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Registration Form */
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
                  disabled={isSubmitting}
                />
              </div>
              <span className="field-hint">Your name will be visible to buyers on your listings</span>
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
                  disabled={isSubmitting}
                />
              </div>
              <span className="field-hint">Must end with @nitj.ac.in (verified before login)</span>
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
                  disabled={isSubmitting}
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
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={17} />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>
        )}

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
