import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestPasswordReset, verifyResetToken, completePasswordReset } from '../utils/authUtils';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedSection from '../components/AnimatedSection';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const PasswordResetPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if we're in reset mode (with token) or request mode
  const isResetMode = !!token;

  // Verify token if in reset mode
  useEffect(() => {
    if (isResetMode) {
      const checkToken = async () => {
        setIsLoading(true);
        try {
          const response = await verifyResetToken(token);
          if (response.success) {
            setIsTokenValid(true);
          } else {
            toast.error('Invalid or expired reset token');
            navigate('/login');
          }
        } catch (error) {
          console.error('Token verification error:', error);
          toast.error('This password reset link is invalid or has expired');
          navigate('/login');
        } finally {
          setIsLoading(false);
        }
      };
      
      checkToken();
    }
  }, [token, navigate, isResetMode]);

  // Handle form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (isResetMode) {
      if (!password) newErrors.password = 'Password is required';
      else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      
      if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    } else {
      if (!email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password reset request
  const handleResetRequest = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await requestPasswordReset(email);
      if (response.success) {
        setIsRequestSent(true);
        toast.success('Password reset instructions have been sent to your email');
      } else {
        toast.error(response.message || 'Failed to send reset instructions');
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      toast.error(error.message || 'An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset completion
  const handleResetCompletion = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await completePasswordReset(token, password);
      if (response.success) {
        setIsResetComplete(true);
        toast.success('Your password has been successfully reset');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset completion error:', error);
      toast.error(error.message || 'An error occurred while resetting your password');
    } finally {
      setIsLoading(false);
    }
  };

  // Render request form
  const renderRequestForm = () => (
    <form onSubmit={handleResetRequest} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800`}
            placeholder="your@email.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <AnimatedButton
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          {isLoading ? 'Sending...' : 'Send Reset Instructions'}
        </AnimatedButton>
      </div>
    </form>
  );

  // Render reset form
  const renderResetForm = () => (
    <form onSubmit={handleResetCompletion} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800`}
            placeholder="••••••••"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.confirmPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800`}
            placeholder="••••••••"
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <div>
        <AnimatedButton
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </AnimatedButton>
      </div>
    </form>
  );

  // Render success message after request
  const renderRequestSuccess = () => (
    <div className="text-center py-4">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Check your email</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        We've sent password reset instructions to your email address. Please check your inbox.
      </p>
      <div className="mt-6">
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Return to login
        </button>
      </div>
    </div>
  );

  // Render success message after reset
  const renderResetSuccess = () => (
    <div className="text-center py-4">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Password reset successful</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Your password has been successfully reset. You will be redirected to the login page shortly.
      </p>
      <div className="mt-6">
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Go to login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AnimatedSection>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {isResetMode ? 'Reset your password' : 'Forgot your password?'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isResetMode 
              ? 'Enter your new password below' 
              : 'Enter your email address and we\'ll send you a link to reset your password'}
          </p>
        </AnimatedSection>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          {isResetMode ? (
            isResetComplete ? renderResetSuccess() : (isTokenValid && renderResetForm())
          ) : (
            isRequestSent ? renderRequestSuccess() : renderRequestForm()
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PasswordResetPage; 