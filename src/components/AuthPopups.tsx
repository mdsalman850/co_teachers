import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthPopupsProps {
  showSignUp: boolean;
  showSignIn: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
  onSwitchToSignUp: () => void;
}

const AuthPopups: React.FC<AuthPopupsProps> = ({
  showSignUp,
  showSignIn,
  onClose,
  onSwitchToSignIn,
  onSwitchToSignUp
}) => {
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (showSignUp || showSignIn) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSignUp, showSignIn]);

  // Function to convert Firebase errors to user-friendly messages
  const getErrorMessage = (error: any) => {
    const errorCode = error.code || error.message;
    
    if (errorCode.includes('auth/invalid-credential') || errorCode.includes('auth/wrong-password')) {
      return 'The entered password is wrong';
    }
    if (errorCode.includes('auth/user-not-found')) {
      return 'Please check the email or password';
    }
    if (errorCode.includes('auth/email-already-in-use')) {
      return 'An account with this email already exists';
    }
    if (errorCode.includes('auth/weak-password')) {
      return 'Password should be at least 6 characters';
    }
    if (errorCode.includes('auth/invalid-email')) {
      return 'Please enter a valid email address';
    }
    if (errorCode.includes('auth/too-many-requests')) {
      return 'Too many failed attempts. Please try again later';
    }
    if (errorCode.includes('auth/network-request-failed')) {
      return 'Network error. Please check your connection';
    }
    
    // Default fallback
    return 'Please check the email or password';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.fullName);
      setSuccess('Account created successfully! Please sign in.');
      setTimeout(() => {
        onSwitchToSignIn();
        setSuccess('');
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
      }, 2000);
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      onClose();
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
      // Redirect to home page after successful sign in
      navigate('/home');
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  return (
    <AnimatePresence>
      {(showSignUp || showSignIn) && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-[#27AE60]/10 to-[#22C1C3]/10 -mx-8 -mt-8 rounded-t-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#0F1724]">
                    {showSignUp ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {showSignUp ? 'Join COTEACHERS today' : 'Sign in to continue learning'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Success Message */}
              {success && (
                <motion.div
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {success}
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Sign Up Form */}
              {showSignUp && (
                <motion.form
                  onSubmit={handleSignUp}
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all duration-200"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all duration-200"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#27AE60] to-[#22C1C3] text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </motion.button>

                  <div className="text-center">
                    <span className="text-gray-600">Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        onSwitchToSignIn();
                      }}
                      className="text-[#27AE60] font-bold hover:underline"
                    >
                      Sign In
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Sign In Form */}
              {showSignIn && (
                <motion.form
                  onSubmit={handleSignIn}
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all duration-200"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#27AE60] to-[#22C1C3] text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </motion.button>

                  <div className="text-center">
                    <span className="text-gray-600">Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        onSwitchToSignUp();
                      }}
                      className="text-[#27AE60] font-bold hover:underline"
                    >
                      Sign Up
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthPopups;
