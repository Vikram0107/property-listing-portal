import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchFilters = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [filters, setFilters] = useState({
    location: queryParams.get('location') || '',
    minPrice: queryParams.get('minPrice') || '',
    maxPrice: queryParams.get('maxPrice') || '',
    propertyType: queryParams.get('propertyType') || '',
    listingType: queryParams.get('listingType') || '',
    bedrooms: queryParams.get('bedrooms') || '',
    bathrooms: queryParams.get('bathrooms') || '',
    sort: queryParams.get('sort') || 'newest'
  });

  useEffect(() => {
    // Update filters when URL changes
    setFilters({
      location: queryParams.get('location') || '',
      minPrice: queryParams.get('minPrice') || '',
      maxPrice: queryParams.get('maxPrice') || '',
      propertyType: queryParams.get('propertyType') || '',
      listingType: queryParams.get('listingType') || '',
      bedrooms: queryParams.get('bedrooms') || '',
      bathrooms: queryParams.get('bathrooms') || '',
      sort: queryParams.get('sort') || 'newest'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    params.append('page', '1');

    const queryString = params.toString();
    navigate(`/properties${queryString ? `?${queryString}` : ''}`);
  };

  const handleReset = () => {
    const resetFilters = {
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      listingType: '',
      bedrooms: '',
      bathrooms: '',
      sort: 'newest'
    };
    setFilters(resetFilters);
    navigate('/properties');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800 rounded-2xl shadow-xl p-6 mb-8 border border-dark-700"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="location"
            placeholder="📍 Search by city or location"
            value={filters.location}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-200 placeholder-gray-500"
          />
          <input
            type="number"
            name="minPrice"
            placeholder="💰 Min Price"
            value={filters.minPrice}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-200 placeholder-gray-500"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="💰 Max Price"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-200 placeholder-gray-500"
          />
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-200"
          >
            <option value="">🏠 All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
          <select
            name="listingType"
            value={filters.listingType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-200"
          >
            <option value="">📋 All Listings</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-200"
          >
            <option value="">🛏️ Any Bedrooms</option>
            <option value="1">1+ Bedrooms</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
            <option value="5">5+ Bedrooms</option>
          </select>
          <select
            name="bathrooms"
            value={filters.bathrooms}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-200"
          >
            <option value="">🚿 Any Bathrooms</option>
            <option value="1">1+ Bathrooms</option>
            <option value="2">2+ Bathrooms</option>
            <option value="3">3+ Bathrooms</option>
            <option value="4">4+ Bathrooms</option>
          </select>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-200"
          >
            <option value="newest">🆕 Newest First</option>
            <option value="price_asc">💰 Price: Low to High</option>
            <option value="price_desc">💰 Price: High to Low</option>
          </select>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button type="submit" className="px-8 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105">
            🔍 Apply Filters
          </button>
          <button type="button" onClick={handleReset} className="px-8 py-2.5 bg-dark-700 text-gray-300 rounded-xl font-semibold hover:bg-dark-600 transition-all">
            🔄 Reset
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SearchFilters;