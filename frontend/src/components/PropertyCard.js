import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaBed, FaBath, FaRulerCombined, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PropertyCard = ({ property, viewMode = 'grid', onFavoriteToggle }) => {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const checkFavorite = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get('/users/favorites');
      const favorites = response.data.data || response.data;
      setIsFavorite(favorites.some(fav => {
        const propertyId = fav.property?._id || fav.property;
        return propertyId === property._id;
      }));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  }, [user, property._id]);

  useEffect(() => {
    checkFavorite();
  }, [checkFavorite]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await axios.delete(`/users/favorites/${property._id}`);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await axios.post('/users/favorites', { propertyId: property._id });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
      if (onFavoriteToggle) onFavoriteToggle();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
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

  const hasMultipleImages = property.images && property.images.length > 1;
  const hasImage = property.images && property.images.length > 0;

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  // Grid view
  return (
    <div className="block group relative">
      <Link to={`/properties/${property._id}`} className="block">
        <div className="card overflow-hidden hover:border-primary-500 transition">
          <div
            className="relative h-56 overflow-hidden bg-dark-700"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {hasImage ? (
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-dark-600 to-dark-700">
                <span className="text-6xl mb-2">🏠</span>
                <span className="text-sm text-gray-400">No image available</span>
              </div>
            )}
            {hasMultipleImages && isHovered && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-dark-900/80 text-white p-2 rounded-full hover:bg-dark-900 transition z-10"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-dark-900/80 text-white p-2 rounded-full hover:bg-dark-900 transition z-10"
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                  {property.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(idx); }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-primary-500 w-3' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                property.listingType === 'sale'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
              }`}>
                {property.listingType === 'sale' ? 'FOR SALE' : 'FOR RENT'}
              </span>
            </div>
            {(property.status === 'sold' || property.status === 'rented') && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-xl uppercase bg-red-600/90 px-4 py-2 rounded-lg">
                  {property.status === 'sold' ? 'SOLD' : 'RENTED'}
                </span>
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-200 group-hover:text-primary-400 transition line-clamp-1">
              {property.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1 truncate">{property.location}</p>
            <p className="text-2xl font-bold text-primary-400 mt-2">
              {formatPrice(property.price)}
              {property.listingType === 'rent' && <span className="text-sm font-normal text-gray-400">/month</span>}
            </p>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-dark-700">
              <div className="flex items-center space-x-2 text-gray-400">
                <FaBed className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-gray-300">{property.bedrooms || 0}</span>
                <span className="text-xs text-gray-500">Beds</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <FaBath className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-gray-300">{property.bathrooms || 0}</span>
                <span className="text-xs text-gray-500">Baths</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <FaRulerCombined className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-gray-300">{property.area || 0}</span>
                <span className="text-xs text-gray-500">sqft</span>
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <div className={`px-2 py-0.5 rounded text-xs font-semibold ${
                property.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                property.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {property.status?.toUpperCase()}
              </div>
              {hasMultipleImages && (
                <span className="text-xs text-gray-500">📸 {property.images.length} photos</span>
              )}
            </div>
          </div>
        </div>
      </Link>
      {/* Favorite Button on LEFT corner with contrast color */}
      <button
        onClick={toggleFavorite}
        disabled={favoriteLoading}
        className={`absolute top-3 left-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isFavorite
            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600'
            : 'bg-dark-800/90 text-gray-300 hover:text-red-500 hover:bg-dark-700 border border-dark-600'
        }`}
      >
        {favoriteLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          isFavorite ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default PropertyCard;