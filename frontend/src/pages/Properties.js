import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import PropertyCard from '../components/PropertyCard';
import Navbar from '../components/Navbar';
import SearchFilters from '../components/SearchFilters';
import LoadingSpinner from '../components/LoadingSpinner';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showSoldProperties, setShowSoldProperties] = useState(false);
  const location = useLocation();

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryString = location.search;
      const response = await axios.get(`/properties${queryString}`);
      const propertyList = response.data.data || response.data;
      setProperties(Array.isArray(propertyList) ? propertyList : []);
      setFilteredProperties(Array.isArray(propertyList) ? propertyList : []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleShowSoldToggle = () => {
    setShowSoldProperties(!showSoldProperties);
    if (!showSoldProperties) {
      const soldProperties = properties.filter(p => p.status === 'sold' || p.status === 'rented');
      setFilteredProperties(soldProperties);
    } else {
      setFilteredProperties(properties);
    }
  };

  const goBack = () => window.history.back();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <button onClick={goBack} className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition">
          <span>←</span>
          <span>Go Back</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">Discover Your Dream Property</h1>
          <p className="text-gray-400 text-lg">Browse through our curated collection of premium properties</p>
        </div>

        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex space-x-3">
            <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-dark-800 text-gray-400 hover:bg-dark-700'}`}>📱 Grid View</button>
            <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg transition ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-dark-800 text-gray-400 hover:bg-dark-700'}`}>📋 List View</button>
          </div>
          <button onClick={handleShowSoldToggle} className={`px-5 py-2 rounded-lg font-semibold transition ${showSoldProperties ? 'bg-dark-700 text-white' : 'bg-dark-800 text-gray-400 hover:bg-dark-700'}`}>
            {showSoldProperties ? '🏠 Show All' : '💰 View Sold/Rented'}
          </button>
        </div>

        <SearchFilters />

        {error ? (
          <div className="text-center py-12 card p-12">
            <p className="text-red-400 text-lg">{error}</p>
            <button onClick={fetchProperties} className="mt-4 btn-primary">Try Again</button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No properties found matching your criteria.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-4">Found <span className="font-bold text-primary-400">{filteredProperties.length}</span> properties</p>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {filteredProperties.map(property => (
                <PropertyCard key={property._id} property={property} viewMode={viewMode} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;