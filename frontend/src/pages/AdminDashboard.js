import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('/admin/stats');
      setStats(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch statistics');
    }
  }, []);

  const fetchPendingProperties = useCallback(async () => {
    try {
      const response = await axios.get('/admin/pending-properties');
      const properties = response.data.data || response.data;
      setPendingProperties(Array.isArray(properties) ? properties : []);
    } catch (error) {
      console.error('Error fetching pending properties:', error);
      toast.error('Failed to fetch pending properties');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('/admin/users');
      const usersList = response.data.data || response.data;
      setUsers(Array.isArray(usersList) ? usersList : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchPendingProperties(),
      fetchUsers()
    ]);
    setLoading(false);
  }, [fetchStats, fetchPendingProperties, fetchUsers]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleApprove = async (propertyId) => {
    try {
      const response = await axios.put(`/admin/approve-property/${propertyId}`);
      if (response.data.success) {
        toast.success('Property approved successfully!');
        fetchPendingProperties();
        fetchStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve property');
    }
  };

  const handleReject = async (propertyId) => {
    try {
      const response = await axios.put(`/admin/reject-property/${propertyId}`);
      if (response.data.success) {
        toast.success('Property rejected!');
        fetchPendingProperties();
        fetchStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject property');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`/admin/users/${userId}`);
        if (response.data.success) {
          toast.success('User deleted successfully');
          fetchUsers();
          fetchStats();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const goBack = () => window.history.back();

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { title: 'Total Properties', value: stats?.totalProperties || 0, icon: '🏘️', color: 'from-blue-500 to-cyan-500' },
    { title: 'Approved', value: stats?.approvedProperties || 0, icon: '✅', color: 'from-green-500 to-emerald-500' },
    { title: 'Pending', value: stats?.pendingProperties || 0, icon: '⏳', color: 'from-yellow-500 to-orange-500' },
    { title: 'Rejected', value: stats?.rejectedProperties || 0, icon: '❌', color: 'from-red-500 to-pink-500' },
    { title: 'Sold/Rented', value: (stats?.soldProperties || 0) + (stats?.rentedProperties || 0), icon: '💰', color: 'from-purple-500 to-indigo-500' },
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'from-teal-500 to-green-500' },
    { title: 'Total Inquiries', value: stats?.totalInquiries || 0, icon: '💬', color: 'from-pink-500 to-rose-500' },
    { title: 'Total Views', value: (stats?.totalViews || 0).toLocaleString(), icon: '👁️', color: 'from-indigo-500 to-purple-500' },
  ];

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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage properties, users, and monitor platform activity</p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 border-b border-dark-700">
          <nav className="flex space-x-8">
            {[
              { id: 'stats', label: '📊 Statistics', icon: '📊' },
              { id: 'pending', label: `⏳ Pending (${pendingProperties.length})`, icon: '⏳' },
              { id: 'users', label: `👥 Users (${users.length})`, icon: '👥' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="card p-6 hover:border-primary-500 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-200">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pending Properties Tab */}
        {activeTab === 'pending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {pendingProperties.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <p className="text-gray-400 text-lg">No pending properties to review.</p>
                <p className="text-gray-500 text-sm mt-2">All properties have been processed</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProperties.map((property, index) => (
                  <motion.div
                    key={property._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card overflow-hidden hover:border-primary-500 transition-all"
                  >
                    <div className="md:flex">
                      <div className="md:w-48 h-48 md:h-auto bg-dark-700 relative">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234b5563"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-dark-600 to-dark-700">
                            <span className="text-4xl mb-2">🏠</span>
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-500 text-white">
                            PENDING
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-200 mb-2">{property.title}</h3>
                            <p className="text-gray-400 text-sm mb-1">{property.location}</p>
                            <p className="text-2xl font-bold text-primary-400 mb-2">
                              ${property.price?.toLocaleString()}
                              {property.listingType === 'rent' && '/month'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Posted by: {property.owner?.name} ({property.owner?.email})
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(property._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center space-x-2"
                            >
                              <span>✅</span>
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(property._id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center space-x-2"
                            >
                              <span>❌</span>
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-4 gap-2 text-sm text-gray-500">
                          <span>🛏️ {property.bedrooms} beds</span>
                          <span>🚿 {property.bathrooms} baths</span>
                          <span>📏 {property.area} sqft</span>
                          <span className="capitalize">🏠 {property.propertyType}</span>
                        </div>
                        <p className="mt-3 text-gray-400 line-clamp-2">{property.description}</p>
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowModal(true);
                          }}
                          className="mt-3 text-primary-400 hover:text-primary-300 text-sm"
                        >
                          View Full Details →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-dark-700/50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                            user.role === 'admin' ? 'from-purple-500 to-pink-500' :
                            user.role === 'owner' ? 'from-blue-500 to-cyan-500' :
                            'from-green-500 to-emerald-500'
                          } flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="font-medium text-gray-200">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                          user.role === 'owner' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {user.role?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-400 hover:text-red-300 transition text-sm flex items-center space-x-1"
                          >
                            <span>🗑️</span>
                            <span>Delete</span>
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Property Details Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-dark-800 p-4 border-b border-dark-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-200">Property Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-200">✕</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="h-48 bg-dark-700 rounded-xl mb-4 overflow-hidden">
                  {selectedProperty.images && selectedProperty.images.length > 0 ? (
                    <img src={selectedProperty.images[0]} alt={selectedProperty.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">🏠</span>
                    </div>
                  )}
                </div>
                <h4 className="text-2xl font-bold text-gray-200">{selectedProperty.title}</h4>
                <p className="text-gray-400 mt-1">{selectedProperty.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><span className="text-gray-500">Price:</span> <span className="text-primary-400 font-bold">${selectedProperty.price?.toLocaleString()}</span></div>
                <div><span className="text-gray-500">Type:</span> <span className="text-gray-300 capitalize">{selectedProperty.listingType}</span></div>
                <div><span className="text-gray-500">Bedrooms:</span> <span className="text-gray-300">{selectedProperty.bedrooms}</span></div>
                <div><span className="text-gray-500">Bathrooms:</span> <span className="text-gray-300">{selectedProperty.bathrooms}</span></div>
                <div><span className="text-gray-500">Area:</span> <span className="text-gray-300">{selectedProperty.area} sqft</span></div>
                <div><span className="text-gray-500">Property Type:</span> <span className="text-gray-300 capitalize">{selectedProperty.propertyType}</span></div>
              </div>
              <div className="mb-4">
                <p className="text-gray-500 mb-2">Description:</p>
                <p className="text-gray-300">{selectedProperty.description}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-500 mb-2">Address:</p>
                <p className="text-gray-300">{selectedProperty.address}</p>
              </div>
              <div className="flex space-x-3 pt-4 border-t border-dark-700">
                <button onClick={() => { handleApprove(selectedProperty._id); setShowModal(false); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">Approve</button>
                <button onClick={() => { handleReject(selectedProperty._id); setShowModal(false); }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">Reject</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;