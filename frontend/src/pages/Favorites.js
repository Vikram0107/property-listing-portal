import React, { useState, useEffect } from 'react';
import axios from '../utils/axios'; // Make sure to use the configured axios instance
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching favorites...');

      const response = await axios.get('/users/favorites');
      console.log('Favorites response:', response.data);

      // Handle both response formats
      const favoritesList = response.data.data || response.data;
      setFavorites(Array.isArray(favoritesList) ? favoritesList : []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch favorites';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      const response = await axios.delete(`/users/favorites/${propertyId}`);
      if (response.data.success) {
        toast.success('Removed from favorites');
        fetchFavorites(); // Refresh the list
      }
    } catch (error) {
      console.error('Remove favorite error:', error);
      toast.error(error.response?.data?.message || 'Failed to remove from favorites');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Favorite Properties</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-bold">Error Loading Favorites</p>
            <p>{error}</p>
            <button
              onClick={fetchFavorites}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {!error && favorites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg mb-4">You haven't saved any favorite properties yet.</p>
            <a href="/properties" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block">
              Browse Properties
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map(fav => {
              const property = fav.property || fav;
              return (
                <div key={fav._id} className="relative">
                  <button
                    onClick={() => removeFavorite(property._id)}
                    className="absolute top-2 right-2 z-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                    title="Remove from favorites"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
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