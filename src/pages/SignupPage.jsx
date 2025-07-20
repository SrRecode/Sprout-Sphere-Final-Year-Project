import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { initGoogleAuth, handleGoogleLogin, initFacebookAuth, handleFacebookLogin } from '../utils/authUtils';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { register, googleAuth, facebookAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveUserData, setSaveUserData] = useState(false);
  const [socialAuthReady, setSocialAuthReady] = useState({
    google: false,
    facebook: false
  });
  
  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { name, email, password, confirmPassword } = formData;

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
    if (e.target.name === 'password') {
      checkPasswordStrength(e.target.value);
    }
    setLocalError('');
  }, []);
  
  const checkPasswordStrength = useCallback((pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    setPasswordStrength(strength);
  }, []);
  
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);
  
  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);
  
  const toggleSaveUserData = useCallback(() => {
    setSaveUserData(prev => !prev);
  }, []);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    if (saveUserData) {
      localStorage.setItem('savedSignupEmail', email);
      localStorage.setItem('savedSignupName', name);
      localStorage.setItem('saveUserData', 'true');
    } else {
      localStorage.removeItem('savedSignupEmail');
      localStorage.removeItem('savedSignupName');
      localStorage.removeItem('saveUserData');
    }
    
    try {
      const success = await register(name, email, password);
      
      if (success) {
        navigate('/');
      } else {
        setLocalError('Registration failed. Please try again.');
      }
    } catch (error) {
      setLocalError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  }, [register, name, email, password, confirmPassword, saveUserData, navigate]);

  // Handle Google signup
  const onGoogleSignup = useCallback(async () => {
    if (!socialAuthReady.google) {
      toast.error('Google signup is not ready yet. Please try again in a moment.');
      return;
    }

    setSocialLoading(true);
    setLocalError('');
    
    try {
      handleGoogleLogin(
        // Success callback
        async (data) => {
          const success = await googleAuth(data);
          if (success) {
            navigate('/');
          } else {
            setLocalError('Google signup failed');
          }
        },
        // Error callback
        (error) => {
          console.error('Google signup error:', error);
          setLocalError('Google signup failed');
          setSocialLoading(false);
        }
      );
    } catch (error) {
      console.error('Google signup error:', error);
      setLocalError('Google signup failed');
      setSocialLoading(false);
    }
  }, [socialAuthReady.google, googleAuth, navigate]);

  // Handle Facebook signup
  const onFacebookSignup = useCallback(async () => {
    if (!socialAuthReady.facebook) {
      toast.error('Facebook signup is not ready yet. Please try again in a moment.');
      return;
    }

    setSocialLoading(true);
    setLocalError('');
    
    try {
      handleFacebookLogin(
        // Success callback
        async (data) => {
          const success = await facebookAuth(data);
          if (success) {
            navigate('/');
          } else {
            setLocalError('Facebook signup failed');
          }
        },
        // Error callback
        (error) => {
          console.error('Facebook signup error:', error);
          setLocalError('Facebook signup failed');
          setSocialLoading(false);
        }
      );
    } catch (error) {
      console.error('Facebook signup error:', error);
      setLocalError('Facebook signup failed');
      setSocialLoading(false);
    }
  }, [socialAuthReady.facebook, facebookAuth, navigate]);

  // Check for saved data on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedSignupEmail');
    const savedName = localStorage.getItem('savedSignupName');
    const shouldSaveData = localStorage.getItem('saveUserData');
    
    if (savedEmail && savedName && shouldSaveData) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        name: savedName
      }));
      setSaveUserData(true);
    }
  }, []);

  return (
    <AnimatedSection 
      animation="fade-in" 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50/50 via-white to-cyan-50/50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto overflow-hidden shadow-card rounded-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Form Section (Left on mobile, Right on desktop) */}
          <div className="bg-white dark:bg-dark-800 p-8 sm:p-10 lg:p-12 md:order-first">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">
                Create Your Account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Join the SproutSphere community today!
              </p>
            </div>

            {localError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm border border-red-200 dark:border-red-900 flex items-start"
              >
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{localError}</span>
              </motion.div>
            )}

            {/* Social Signup Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={onGoogleSignup}
                disabled={socialLoading || !socialAuthReady.google}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {socialLoading ? 'Signing up...' : 'Continue with Google'}
              </button>
              
              <button
                type="button"
                onClick={onFacebookSignup}
                disabled={socialLoading || !socialAuthReady.facebook}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
                {socialLoading ? 'Signing up...' : 'Continue with Facebook'}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">Or sign up with email</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User size={18} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="pl-10 appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 sm:text-sm transition-colors duration-200"
                    placeholder="Your Name"
                    value={name}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={18} className="text-gray-400 dark:text-gray-500" />
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength="6"
                    className="pl-10 appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 sm:text-sm transition-colors duration-200"
                    placeholder="Create a password (min. 6 characters)"
                    value={password}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                
                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i < passwordStrength 
                              ? [
                                  'bg-red-500 dark:bg-red-600',
                                  'bg-orange-500 dark:bg-orange-600',
                                  'bg-yellow-500 dark:bg-yellow-600',
                                  'bg-green-500 dark:bg-green-600'
                                ][passwordStrength - 1] 
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {passwordStrength === 0 && 'Very weak - Add more characters'}
                      {passwordStrength === 1 && 'Weak - Add numbers or symbols'}
                      {passwordStrength === 2 && 'Fair - Add uppercase letters'}
                      {passwordStrength === 3 && 'Good - Almost there'}
                      {passwordStrength === 4 && 'Strong - Excellent password!'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength="6"
                    className="pl-10 appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 sm:text-sm transition-colors duration-200"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                
                {/* Password match indicator */}
                {confirmPassword && (
                  <div className="mt-1 text-xs flex items-center">
                    {confirmPassword === password ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center">
                        <CheckCircle size={14} className="mr-1" />
                        Passwords match
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">
                        Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                <input
                  id="save-data"
                  name="save-data"
                  type="checkbox"
                  checked={saveUserData}
                  onChange={toggleSaveUserData}
                  className="h-4 w-4 text-primary-600 dark:text-primary-500 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded transition-colors"
                />
                <label htmlFor="save-data" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Save my information for next time
                </label>
              </div>
              
              <div>
                <AnimatedButton 
                  type="submit" 
                  variant="primary" 
                  className="w-full justify-center"
                  size="lg"
                  disabled={loading || socialLoading}
                  icon={ChevronRight}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </AnimatedButton>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 hover:underline transition-colors">
                Log in
              </Link>
            </p>
          </div>
          
          {/* Visual Panel (Right on mobile, Left on desktop) */}
          <div className="hidden md:block relative md:order-last">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-800/90 mix-blend-multiply dark:mix-blend-hard-light z-10"></div>
            
            {/* Dark mode overlay */}
            <div className="absolute inset-0 bg-dark-900/10 dark:bg-dark-900/40 z-10"></div>
            
            {/* Background image */}
            <img 
              src="/images/Generated Image March 30, 2025 - 10_41AM.jpeg"
              alt="Plants in garden" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center p-8 sm:p-10 lg:p-12 z-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-white/10 dark:bg-dark-800/20 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
              >
                <h3 className="text-2xl font-bold text-white mb-6 font-display">Grow With SproutSphere</h3>
                <ul className="space-y-5">
                  {[
                    'Get personalized plant recommendations',
                    'Connect with experienced gardeners',
                    'Track your plant growth and progress',
                    'Access expert gardening advice'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center text-white/90"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (index * 0.1) }}
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-400/30 flex items-center justify-center mr-3">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.div 
                  className="mt-8 text-xs text-white/70 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex -space-x-2 mr-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary-300/40 border border-white/20 flex items-center justify-center text-white text-xs ring-2 ring-white/10">
                        {["MS", "JK", "TP"][i-1]}
                      </div>
                    ))}
                  </div>
                  <span>Join 50,000+ gardeners today</span>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="absolute bottom-5 right-5 text-white/70 text-xs z-20">
              SproutSphere © 2025
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
};

export default SignupPage; 