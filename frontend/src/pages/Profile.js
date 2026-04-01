import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || ''
      });
      if (user.profilePicture) {
        setAvatarPreview(user.profilePicture);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('phone', formData.phone);
    if (avatar) {
      submitData.append('avatar', avatar);
    }

    try {
      const response = await axios.put('/users/profile', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        // Update local storage with new token
        localStorage.setItem('token', response.data.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;

        toast.success('Profile updated successfully!');
        setEditing(false);
        setAvatar(null);

        // Refresh page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const goBack = () => navigate(-1);

  if (!user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <button onClick={goBack} className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition">
          <span>←</span>
          <span>Go Back</span>
        </button>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative inline-block"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center mx-auto shadow-xl overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl text-white">
                      {user.name?.charAt(0).toUpperCase() || '👤'}
                    </span>
                  )}
                </div>
                {editing && (
                  <label className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 cursor-pointer hover:bg-primary-700 transition">
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                )}
              </motion.div>
              <div className="mt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                  user.role === 'owner' ? 'bg-primary-500/20 text-primary-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {user.role?.toUpperCase()}
                </span>
              </div>
            </div>

            {!editing ? (
              <div className="space-y-4">
                <div className="border-b border-dark-700 pb-4">
                  <p className="text-sm text-gray-400 mb-1">Full Name</p>
                  <p className="text-lg text-gray-200 font-semibold">{user.name}</p>
                </div>
                <div className="border-b border-dark-700 pb-4">
                  <p className="text-sm text-gray-400 mb-1">Email Address</p>
                  <p className="text-lg text-gray-200">{user.email}</p>
                </div>
                <div className="border-b border-dark-700 pb-4">
                  <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                  <p className="text-lg text-gray-200">{user.phone || 'Not provided'}</p>
                </div>
                <div className="border-b border-dark-700 pb-4">
                  <p className="text-sm text-gray-400 mb-1">Member Since</p>
                  <p className="text-lg text-gray-200">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="pt-4 flex space-x-4">
                  <button onClick={() => setEditing(true)} className="flex-1 btn-primary">
                    Edit Profile
                  </button>
                  <Link to="/change-password" className="flex-1 btn-secondary text-center">
                    Change Password
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="input-field opacity-60 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button type="submit" disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
                    {uploading ? 'Uploading...' : loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="flex-1 btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;