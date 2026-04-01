import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    address: '',
    propertyType: 'apartment',
    listingType: 'sale',
    bedrooms: '',
    bathrooms: '',
    area: ''
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/properties/${id}`);
      const property = response.data.data || response.data;

      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || '',
        location: property.location || '',
        address: property.address || '',
        propertyType: property.propertyType || 'apartment',
        listingType: property.listingType || 'sale',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area: property.area || ''
      });

      setExistingImages(property.images || []);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to fetch property');
      navigate('/my-properties');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newImages.length > 5) {
      toast.error('You can only have up to 5 images total');
      return;
    }

    setNewImages([...newImages, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
  };

  const removeNewImage = (indexToRemove) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setNewImages(newImages.filter((_, index) => index !== indexToRemove));
    setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    existingImages.forEach(image => {
      submitData.append('existingImages', image);
    });

    newImages.forEach(image => {
      submitData.append('images', image);
    });

    try {
      await axios.put(`/properties/${id}`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Property updated successfully!');
      navigate('/my-properties');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update property');
    } finally {
      setSubmitting(false);
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    }
  };

  const goBack = () => navigate(-1);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={goBack} className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition">
            <span>←</span>
            <span>Go Back</span>
          </button>

          <h1 className="text-3xl font-bold mb-8 text-gray-200">Edit Property</h1>

          <form onSubmit={handleSubmit} className="card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 font-semibold">Property Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input-field" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 font-semibold">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" className="input-field" />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Price *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="input-field" />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input-field" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 font-semibold">Full Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required className="input-field" />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Property Type *</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="input-field">
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Listing Type *</label>
                <select name="listingType" value={formData.listingType} onChange={handleChange} className="input-field">
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Bedrooms *</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required min="0" className="input-field" />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Bathrooms *</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required min="0" step="0.5" className="input-field" />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Area (sq ft) *</label>
                <input type="number" name="area" value={formData.area} onChange={handleChange} required min="0" className="input-field" />
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2 font-semibold">Current Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((image, idx) => (
                      <div key={idx} className="relative group">
                        <img src={image} alt={`Property ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 font-semibold">Upload New Images (Max 5 total)</label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-dark-700 rounded-xl">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <label htmlFor="file-upload" className="cursor-pointer text-primary-400 hover:text-primary-300">
                      <span>Upload new images</span>
                      <input id="file-upload" type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button type="submit" disabled={submitting} className="flex-1 btn-primary disabled:opacity-50">
                {submitting ? 'Updating...' : 'Update Property'}
              </button>
              <button type="button" onClick={goBack} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;