import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/properties/my-properties');
      const propertyList = response.data.data || response.data;
      setProperties(Array.isArray(propertyList) ? propertyList : []);
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`/properties/${id}`);
        toast.success('Property deleted successfully');
        fetchMyProperties();
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = { pending: 'bg-yellow-500', approved: 'bg-green-500', rejected: 'bg-red-500', sold: 'bg-gray-700', rented: 'bg-blue-700' };
    return <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${colors[status] || 'bg-gray-500'}`}>{status?.toUpperCase() || 'PENDING'}</span>;
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

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-200">My Properties</h1>
          <Link to="/add-property" className="btn-primary">Add New Property</Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12 card p-12">
            <p className="text-gray-400 text-lg mb-4">You haven't listed any properties yet.</p>
            <Link to="/add-property" className="btn-primary inline-block">List Your First Property</Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {properties.map(property => (
              <div key={property._id} className="card overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-64 h-48 md:h-auto bg-dark-800">
                    <img src={property.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'} alt={property.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">{property.title}</h3>
                        <p className="text-gray-400 mb-2">{property.location}</p>
                        <p className="text-2xl font-bold text-primary-400 mb-2">${(property.price || 0).toLocaleString()}{property.listingType === 'rent' && '/month'}</p>
                        <div className="flex space-x-2 mb-3">
                          {getStatusBadge(property.status)}
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${property.listingType === 'sale' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{property.listingType?.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/edit-property/${property._id}`} className="bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 text-sm">Edit</Link>
                        <button onClick={() => handleDelete(property._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">Delete</button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">Posted: {new Date(property.createdAt).toLocaleDateString()} | Views: {property.views || 0}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;