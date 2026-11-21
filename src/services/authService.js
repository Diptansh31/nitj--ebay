import { supabase } from '../lib/supabaseClient';

/**
 * Validates that an email belongs to the official NITJ domain (@nitj.ac.in)
 * @param {string} email
 * @returns {boolean}
 */
export const isNitjEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase().endsWith('@nitj.ac.in');
};

/**
 * Register a new student account using Supabase Auth
 * 
 * Requirements:
 * - Email must end with @nitj.ac.in
 * - Password and confirm password must match
 * - Passes full_name in user metadata (used by the database trigger for profiles)
 * - Sets email confirmation redirect URL
 * - Detects already-registered accounts
 * 
 * @param {Object} params
 * @param {string} params.fullName - Student's full name
 * @param {string} params.email - Student's NITJ college email
 * @param {string} params.password - Account password
 * @param {string} [params.confirmPassword] - Password confirmation
 * @returns {Promise<{ data: any, error: Error | null }>}
 */
export const registerUser = async ({ fullName, email, password, confirmPassword }) => {
  try {
    const trimmedFullName = fullName?.trim() || '';
    const trimmedEmail = email?.trim().toLowerCase() || '';

    // 1. Validation checks
    if (!trimmedFullName) {
      return { data: null, error: new Error('Please enter your full name.') };
    }

    if (!trimmedEmail) {
      return { data: null, error: new Error('Please enter your NITJ college email.') };
    }

    if (!isNitjEmail(trimmedEmail)) {
      return {
        data: null,
        error: new Error('Only official @nitj.ac.in email addresses are permitted to register.'),
      };
    }

    if (!password) {
      return { data: null, error: new Error('Please enter a password.') };
    }

    if (password.length < 6) {
      return {
        data: null,
        error: new Error('Password must be at least 6 characters long.'),
      };
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return {
        data: null,
        error: new Error('Passwords do not match. Please verify and try again.'),
      };
    }

    // 2. Determine redirect URL for email verification
    // Resolves base path for GitHub Pages (/nitj--ebay/login) while preserving localhost dev redirect
    let redirectUrl;
    if (typeof window !== 'undefined') {
      if (import.meta.env.VITE_AUTH_REDIRECT_URL) {
        redirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL;
      } else {
        const origin = window.location.origin;
        const base = import.meta.env.BASE_URL || '/';
        const normalizedBase = base.endsWith('/') ? base : `${base}/`;
        redirectUrl = `${origin}${normalizedBase}login`;
      }
    }

    // 3. Register with Supabase Auth
    // Note: full_name is passed in options.data so the backend trigger creates the profile record
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: trimmedFullName,
        },
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      return { data: null, error };
    }

    // Supabase security behavior: If a user is already registered with email confirmation enabled,
    // signUp may return a user object with an empty identities array to prevent user enumeration.
    if (data?.user?.identities && data.user.identities.length === 0) {
      return {
        data: null,
        error: new Error('An account with this email already exists. Please log in instead.'),
      };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
};

/**
 * Log in an existing student with college email and password
 * 
 * @param {Object} params
 * @param {string} params.email - Student's NITJ college email
 * @param {string} params.password - Student's password
 * @returns {Promise<{ data: any, error: Error | null }>}
 */
export const loginUser = async ({ email, password }) => {
  try {
    const trimmedEmail = email?.trim().toLowerCase() || '';

    if (!trimmedEmail) {
      return { data: null, error: new Error('Please enter your NITJ email address.') };
    }

    if (!password) {
      return { data: null, error: new Error('Please enter your password.') };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      let friendlyMessage = error.message;

      // Handle unverified email error specifically
      if (
        error.message.toLowerCase().includes('email not confirmed') ||
        error.message.toLowerCase().includes('not confirmed')
      ) {
        friendlyMessage =
          'Your email has not been verified yet. Please check your NITJ student inbox and click the verification link before logging in.';
      } else if (
        error.message.toLowerCase().includes('invalid login credentials') ||
        error.message.toLowerCase().includes('invalid credentials')
      ) {
        friendlyMessage = 'Invalid email or password. Please verify your credentials and try again.';
      }

      return { data: null, error: new Error(friendlyMessage) };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
};

/**
 * Log out the currently authenticated user
 * @returns {Promise<{ error: Error | null }>}
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error };
    }
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
};

/**
 * Retrieve the currently authenticated user from Supabase Auth
 * @returns {Promise<any | null>}
 */
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
};

/**
 * Retrieve the current active session
 * @returns {Promise<any | null>}
 */
export const getCurrentSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
};
