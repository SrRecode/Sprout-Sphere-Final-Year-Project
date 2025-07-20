import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { initGoogleAuth, handleGoogleLogin, initFacebookAuth, handleFacebookLogin } from '../utils/authUtils';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, AlertCircle } from '@heroicons/react/24/outline';
import AnimatedSection from '../components/AnimatedSection';
import AnimatedButton from '../components/AnimatedButton';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, googleAuth, facebookAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState(null);
  const [socialAuthReady, setSocialAuthReady] = useState({
    google: false,
    facebook: false
  });

  const { email, password } = formData;
  const from = useMemo(() => location.state?.from?.pathname || "/", [location.state?.from?.pathname]);

  // Initialize social login SDKs
  useEffect(() => {
    const initSocialAuth = async () => {
      try {
        await initGoogleAuth();
        setSocialAuthReady(prev => ({ ...prev, google: true }));
      } catch (err) {
        console.error('Failed to initialize Google auth:', err);
      }

      try {
        await initFacebookAuth();
        setSocialAuthReady(prev => ({ ...prev, facebook: true }));
      } catch (err) {
        console.error('Failed to initialize Facebook auth:', err);
      }
    };

    initSocialAuth();
  }, []);

  const onChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError(null); // Clear error when user types
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleRememberMe = useCallback(() => {
    setRememberMe(prev => !prev);
  }, []);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberMe');
    }
    
    try {
      const success = await login(email, password); 
      
      if (success) {
        navigate(from, { replace: true }); 
      } else {
        setFormError('Invalid email or password');
      }
    } catch (error) {
      setFormError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  }, [login, email, password, rememberMe, navigate, from]);

  // Handle Google login
  const onGoogleLogin = useCallback(async () => {
    if (!socialAuthReady.google) {
      toast.error('Google login is not ready yet. Please try again in a moment.');
      return;
    }

    setSocialLoading(true);
    setFormError(null);
    
    try {
      handleGoogleLogin(
        // Success callback
        async (data) => {
          const success = await googleAuth(data);
          if (success) {
            navigate(from, { replace: true });
          } else {
            setFormError('Google login failed');
          }
        },
        // Error callback
        (error) => {
          console.error('Google login error:', error);
          setFormError('Google login failed');
          setSocialLoading(false);
        }
      );
    } catch (error) {
      console.error('Google login error:', error);
      setFormError('Google login failed');
      setSocialLoading(false);
    }
  }, [socialAuthReady.google, googleAuth, navigate, from]);

  // Handle Facebook login
  const onFacebookLogin = useCallback(async () => {
    if (!socialAuthReady.facebook) {
      toast.error('Facebook login is not ready yet. Please try again in a moment.');
      return;
    }

    setSocialLoading(true);
    setFormError(null);
    
    try {
      handleFacebookLogin(
        // Success callback
        async (data) => {
          const success = await facebookAuth(data);
          if (success) {
            navigate(from, { replace: true });
          } else {
            setFormError('Facebook login failed');
          }
        },
        // Error callback
        (error) => {
          console.error('Facebook login error:', error);
          setFormError('Facebook login failed');
          setSocialLoading(false);
        }
      );
    } catch (error) {
      console.error('Facebook login error:', error);
      setFormError('Facebook login failed');
      setSocialLoading(false);
    }
  }, [socialAuthReady.facebook, facebookAuth, navigate, from]);

  // Check for remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const shouldRemember = localStorage.getItem('rememberMe');
    
    if (rememberedEmail && shouldRemember) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <AnimatedSection 
      animation="fade-in" 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50/50 via-white to-cyan-50/50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div 
        className="w-full max-w-4xl mx-auto overflow-hidden shadow-card rounded-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Panel (Left) */}
          <div className="relative hidden md:block">
            {/* Semi-transparent overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/60 to-cyan-500/60 mix-blend-multiply dark:mix-blend-overlay z-10"></div>
            
            {/* Dark mode overlay */}
            <div className="absolute inset-0 bg-dark-900/30 dark:bg-dark-900/60 z-10"></div>
            
            <img 
              src="/images/Bonsai.jpeg"
              alt="Login illustration" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Content */}
            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
              <div
                className="bg-white/10 dark:bg-dark-800/30 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
              >
                <h2 className="text-3xl font-bold text-white mb-3 font-display">
                  Welcome to SproutSphere
                </h2>
                <p className="text-white/90 mb-4">
                  Your AI-powered guide to gardening success.
                </p>
                <div className="flex gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-primary-300 animate-pulse"></span>
                  <span className="inline-flex h-2 w-2 rounded-full bg-primary-300 animate-pulse" style={{ animationDelay: '300ms' }}></span>
                  <span className="inline-flex h-2 w-2 rounded-full bg-primary-300 animate-pulse" style={{ animationDelay: '600ms' }}></span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel (Right) */}
          <div className="bg-white dark:bg-dark-800 p-8 sm:p-10 lg:p-12">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">
                Sign in to your account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continue your gardening journey
              </p>
            </div>

            {formError && (
              <div
                className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm border border-red-200 dark:border-red-900 flex items-start"
              >
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={onGoogleLogin}
                disabled={socialLoading || !socialAuthReady.google}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {socialLoading ? 'Signing in...' : 'Continue with Google'}
              </button>
              
              <button
                type="button"
                onClick={onFacebookLogin}
                disabled={socialLoading || !socialAuthReady.facebook}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
                {socialLoading ? 'Signing in...' : 'Continue with Facebook'}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">Or continue with email</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 sm:text-sm transition-colors duration-200"
                    placeholder="you@example.com"
                    value={email}
                    onChange={onChange}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Link to="/reset-password" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockClosedIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    minLength="6"
                    className="pl-10 appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 sm:text-sm transition-colors duration-200"
                    placeholder="Enter your password"
                    value={password}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={toggleRememberMe}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
              </div>

              <div>
                <AnimatedButton
                  type="submit"
                  disabled={loading || socialLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Sign in
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </AnimatedButton>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default LoginPage;
