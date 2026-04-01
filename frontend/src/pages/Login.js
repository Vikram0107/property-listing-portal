import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="w-full max-w-md"
          >
            <motion.div
              className="relative bg-dark-800 rounded-2xl shadow-2xl overflow-hidden"
              whileHover={{ boxShadow: '0 25px 50px -12px rgba(59,130,246,0.25)' }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10"
                animate={{
                  background: [
                    'linear-gradient(45deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                    'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))',
                    'linear-gradient(225deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                    'linear-gradient(315deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))',
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              <div className="relative p-8">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-5xl mb-4"
                  >
                    🔐
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-200">Welcome Back!</h2>
                  <p className="text-gray-400 mt-2">Sign in to your account</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-200 transition-all"
                        placeholder="Enter your email"
                      />
                      <motion.div
                        className="absolute left-0 bottom-0 h-0.5 bg-primary-500"
                        initial={{ width: 0 }}
                        animate={{ width: email ? '100%' : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-200 pr-12"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                      <motion.div
                        className="absolute left-0 bottom-0 h-0.5 bg-primary-500"
                        initial={{ width: 0 }}
                        animate={{ width: password ? '100%' : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-between"
                  >
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-400">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                      Forgot password?
                    </Link>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      background: loading
                        ? 'linear-gradient(135deg, #4b5563, #374151)'
                        : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    }}
                    className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                      />
                    ) : (
                      'Sign In'
                    )}
                  </motion.button>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 text-center"
                >
                  <p className="text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">
                      Sign up
                    </Link>
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center text-sm text-gray-500"
            >
              <p>Demo Accounts:</p>
              <p>Admin: admin@example.com / admin123</p>
              <p>Owner: owner@test.com / password123</p>
              <p>Buyer: buyer@test.com / password123</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;