import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaBed, FaBath, FaRulerCombined, FaHeart, FaRegHeart, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [sendingInquiry, setSendingInquiry] = useState(false);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/properties/${id}`);
      const propertyData = response.data.data || response.data;
      setProperty(propertyData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load property';
      setError(errorMessage);
      toast.error(errorMessage);
      if (error.response?.status === 404) {
        setTimeout(() => navigate('/properties'), 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const checkFavorite = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get('/users/favorites');
      const favorites = response.data.data || response.data;
      setIsFavorite(favorites.some(fav => {
        const propertyId = fav.property?._id || fav.property;
        return propertyId === id;
      }));
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  }, [user, id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  useEffect(() => {
    if (user && property) {
      checkFavorite();
    }
  }, [user, property, checkFavorite]);

  const nextImage = () => {
    if (property?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to send an inquiry');
      navigate('/login');
      return;
    }

    if (!inquiryMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSendingInquiry(true);
    try {
      const response = await axios.post('/inquiries', {
        propertyId: id,
        message: inquiryMessage
      });

      if (response.data.success) {
        toast.success('Inquiry sent successfully!');
        setInquiryMessage('');
        setShowInquiryForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setSendingInquiry(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`/users/favorites/${id}`);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await axios.post('/users/favorites', { propertyId: id });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    }
  };

  const formatPrice = (price) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const goBack = () => navigate(-1);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
            <button onClick={goBack} className="mt-4 btn-primary">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const isOwner = user && (user._id === property.owner?._id || user.role === 'admin');
  const hasImages = property.images && property.images.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <button onClick={goBack} className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition">
          <span>←</span>
          <span>Go Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              {/* Image Gallery */}
              <div className="relative">
                <div className="relative h-96 overflow-hidden cursor-pointer bg-dark-700" onClick={() => setIsModalOpen(true)}>
                  {hasImages ? (
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        src={property.images[currentImageIndex]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-dark-600 to-dark-700">
                      <div className="text-8xl mb-4 animate-float">🏠</div>
                      <p className="text-gray-400 text-lg">No images available</p>
                      <p className="text-gray-500 text-sm mt-2">Visualize your dream home</p>
                    </div>
                  )}

                  {hasImages && property.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-dark-900/80 text-white p-2 rounded-full hover:bg-dark-900 transition"
                      >
                        <FaChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-dark-900/80 text-white p-2 rounded-full hover:bg-dark-900 transition"
                      >
                        <FaChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {property.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIndex ? 'bg-primary-500 w-4' : 'bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="absolute top-4 right-4 space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    property.listingType === 'sale'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                  }`}>
                    {property.listingType === 'sale' ? 'FOR SALE' : 'FOR RENT'}
                  </span>
                  {property.status !== 'approved' && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500 text-white">
                      {property.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-200">{property.title}</h1>
                    <p className="text-gray-400 mt-2 flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 mr-1 text-primary-400" />
                      {property.location}
                    </p>
                  </div>
                  {user && !isOwner && property.status === 'approved' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleFavorite}
                      className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
                        isFavorite
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-dark-700 text-gray-300 hover:text-red-400 hover:bg-dark-600'
                      }`}
                    >
                      {isFavorite ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                      <span>{isFavorite ? 'Saved' : 'Save'}</span>
                    </motion.button>
                  )}
                </div>

                <p className="text-3xl font-bold text-primary-400 mb-6">
                  {formatPrice(property.price)}
                  {property.listingType === 'rent' && <span className="text-lg font-normal text-gray-400">/month</span>}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-dark-700 rounded-xl">
                    <FaBed className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                    <div className="font-semibold text-2xl text-gray-200">{property.bedrooms}</div>
                    <div className="text-sm text-gray-400">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-dark-700 rounded-xl">
                    <FaBath className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                    <div className="font-semibold text-2xl text-gray-200">{property.bathrooms}</div>
                    <div className="text-sm text-gray-400">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-dark-700 rounded-xl">
                    <FaRulerCombined className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                    <div className="font-semibold text-2xl text-gray-200">{property.area}</div>
                    <div className="text-sm text-gray-400">Sq Ft</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-200 mb-3">Description</h2>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{property.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-700">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FaCalendarAlt className="w-4 h-4 text-primary-400" />
                    <span className="text-sm">Listed: {new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FaEye className="w-4 h-4 text-primary-400" />
                    <span className="text-sm">{property.views || 0} views</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-gray-200 mb-3 flex items-center">
                    <FaMapMarkerAlt className="w-5 h-5 mr-2 text-primary-400" />
                    Address
                  </h2>
                  <p className="text-gray-400">{property.address}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6 mb-6 sticky top-24"
            >
              <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                <FaPhone className="w-5 h-5 mr-2 text-primary-400" />
                Contact Information
              </h2>
              <div className="p-4 bg-dark-700 rounded-xl">
                <p className="font-semibold text-gray-200 text-lg">{property.owner?.name || 'Property Owner'}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FaEnvelope className="w-4 h-4" />
                    <span className="text-sm">{property.owner?.email || 'Not available'}</span>
                  </div>
                  {property.owner?.phone && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <FaPhone className="w-4 h-4" />
                      <span className="text-sm">{property.owner.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {!isOwner && property.status === 'approved' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Interested?</h2>

                {!user ? (
                  <div className="text-center">
                    <p className="text-gray-400 mb-3">Please login to send an inquiry</p>
                    <button onClick={() => navigate('/login')} className="btn-primary w-full">Login to Contact</button>
                  </div>
                ) : user.role === 'owner' ? (
                  <div className="text-center p-4 bg-dark-700 rounded-xl">
                    <p className="text-gray-400">This is your property</p>
                  </div>
                ) : user.role === 'buyer' ? (
                  !showInquiryForm ? (
                    <button onClick={() => setShowInquiryForm(true)} className="btn-primary w-full flex items-center justify-center space-x-2">
                      <FaEnvelope className="w-4 h-4" />
                      <span>Send Inquiry</span>
                    </button>
                  ) : (
                    <form onSubmit={handleInquiry}>
                      <textarea
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Write your message here..."
                        className="w-full p-3 bg-dark-700 border border-dark-600 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-200 placeholder-gray-500"
                        rows="5"
                        required
                      />
                      <div className="flex space-x-2">
                        <button type="submit" disabled={sendingInquiry} className="flex-1 btn-primary disabled:opacity-50">
                          {sendingInquiry ? 'Sending...' : 'Send'}
                        </button>
                        <button type="button" onClick={() => setShowInquiryForm(false)} className="flex-1 btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )
                ) : null}
              </motion.div>
            )}

            {isOwner && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Property Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      property.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      property.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {property.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Views:</span>
                    <span className="font-semibold text-gray-200">{property.views || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Listed:</span>
                    <span className="text-sm text-gray-400">{new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => navigate(`/edit-property/${property._id}`)} className="btn-primary w-full mt-3">
                    Edit Property
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal for Image Gallery */}
      <AnimatePresence>
        {isModalOpen && hasImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
            >
              ✕
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 text-white text-3xl hover:text-gray-300 z-10"
            >
              <FaChevronLeft className="w-8 h-8" />
            </button>
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 text-white text-3xl hover:text-gray-300 z-10"
            >
              <FaChevronRight className="w-8 h-8" />
            </button>
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {property.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-primary-500 w-4' : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetails;