import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaHeartBroken, FaHome } from 'react-icons/fa';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/favorites');
      const favoritesList = response.data.data || response.data;
      setFavorites(Array.isArray(favoritesList) ? favoritesList : []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await axios.delete(`/users/favorites/${propertyId}`);
      toast.success('Removed from favorites');
      fetchFavorites();
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  const goBack = () => window.history.back();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <button onClick={goBack} className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition">
          <span>←</span>
          <span>Go Back</span>
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-500 mb-4">
            <FaHeartBroken className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            My Favorite Properties
          </h1>
          <p className="text-gray-400 mt-2">Properties you've saved for later</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12 card p-12">
            <div className="text-6xl mb-4">🤍</div>
            <p className="text-gray-400 text-lg mb-4">You haven't saved any favorite properties yet.</p>
            <Link to="/properties" className="inline-flex items-center space-x-2 btn-primary">
              <FaHome className="w-4 h-4" />
              <span>Browse Properties</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map(fav => {
              const property = fav.property || fav;
              return (
                <div key={fav._id} className="relative group">
                  <button
                    onClick={() => handleRemoveFavorite(property._id)}
                    className="absolute top-3 left-3 z-20 w-9 h-9 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                    title="Remove from favorites"
                  >
                    <FaHeartBroken className="w-4 h-4" />
                  </button>
                  <PropertyCard property={property} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;