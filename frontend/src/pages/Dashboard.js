import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();

  const buyerLinks = [
    { to: '/favorites', icon: '❤️', title: 'Saved Properties', description: 'View your favorite listings', color: 'from-red-500 to-pink-500' },
    { to: '/my-inquiries', icon: '💬', title: 'My Inquiries', description: 'Track your property inquiries', color: 'from-blue-500 to-cyan-500' },
    { to: '/properties', icon: '🔍', title: 'Browse Properties', description: 'Search for new properties', color: 'from-green-500 to-emerald-500' },
    { to: '/change-password', icon: '🔐', title: 'Change Password', description: 'Update your password for security', color: 'from-purple-500 to-pink-500' }
  ];

  const ownerLinks = [
    { to: '/my-properties', icon: '🏠', title: 'My Properties', description: 'Manage your listings', color: 'from-blue-500 to-indigo-500' },
    { to: '/add-property', icon: '➕', title: 'Add Property', description: 'List a new property', color: 'from-green-500 to-teal-500' },
    { to: '/my-inquiries', icon: '💬', title: 'Property Inquiries', description: 'Respond to buyer inquiries', color: 'from-yellow-500 to-orange-500' },
    { to: '/change-password', icon: '🔐', title: 'Change Password', description: 'Update your password for security', color: 'from-purple-500 to-pink-500' }
  ];

  const links = user?.role === 'buyer' ? buyerLinks : ownerLinks;
  const goBack = () => window.history.back();

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <button onClick={goBack} className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition">
          <span>←</span>
          <span>Go Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block p-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-full mb-4"
          >
            <span className="text-5xl">👋</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400 mt-3 text-lg">Manage your property activities from your dashboard</p>
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-dark-800 rounded-full">
            <span className={`w-2 h-2 rounded-full ${user?.role === 'admin' ? 'bg-purple-500' : user?.role === 'owner' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
            <span className="text-sm text-gray-400">Logged in as</span>
            <span className="text-sm font-semibold text-gray-200 capitalize">{user?.role}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {links.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Link to={link.to} className="block h-full">
                <div className="card p-6 h-full hover:border-primary-500 transition-all duration-300 group">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{link.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-2 group-hover:text-primary-400 transition">
                    {link.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{link.description}</p>
                  <div className="mt-4 flex items-center text-primary-400 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-sm">Get Started</span>
                    <span className="ml-1">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {user?.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Link to="/admin">
              <div className="card p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:border-purple-500 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-200 group-hover:text-purple-400 transition">Admin Dashboard</h3>
                      <p className="text-gray-400">Access admin controls, manage users, and approve properties</p>
                    </div>
                  </div>
                  <span className="text-purple-400 group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="card p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="text-lg font-semibold text-gray-200">Active Listings</h4>
            <p className="text-2xl font-bold text-primary-400 mt-2">View all properties</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl mb-2">💬</div>
            <h4 className="text-lg font-semibold text-gray-200">Inquiries</h4>
            <p className="text-2xl font-bold text-primary-400 mt-2">Check your messages</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl mb-2">❤️</div>
            <h4 className="text-lg font-semibold text-gray-200">Favorites</h4>
            <p className="text-2xl font-bold text-primary-400 mt-2">Saved properties</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;