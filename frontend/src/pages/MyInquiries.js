import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const MyInquiries = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);
  const [responseText, setResponseText] = useState('');

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = user?.role === 'owner' ? '/inquiries/owner-inquiries' : '/inquiries/my-inquiries';
      const response = await axios.get(endpoint);
      const inquiriesList = response.data.data || response.data;
      setInquiries(Array.isArray(inquiriesList) ? inquiriesList : []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleRespond = async (inquiryId) => {
    if (!responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }
    try {
      await axios.put(`/inquiries/${inquiryId}/respond`, { response: responseText });
      toast.success('Response sent successfully');
      setResponding(null);
      setResponseText('');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to send response');
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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

        <h1 className="text-3xl font-bold mb-8 text-gray-200">{user?.role === 'owner' ? 'Property Inquiries' : 'My Inquiries'}</h1>

        {inquiries.length === 0 ? (
          <div className="text-center py-12 card p-12">
            <p className="text-gray-400 text-lg">No inquiries found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map(inquiry => (
              <div key={inquiry._id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">
                      {user?.role === 'owner' ? `From: ${inquiry.buyer?.name || 'Unknown'}` : `About: ${inquiry.property?.title || 'Property'}`}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(inquiry.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    inquiry.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                  } text-white`}>{inquiry.status?.toUpperCase()}</span>
                </div>
                <p className="text-gray-300 mb-4">{inquiry.message}</p>
                {inquiry.response && (
                  <div className="mt-4 p-4 bg-dark-700 rounded-lg">
                    <p className="font-semibold text-gray-300 mb-2">Response:</p>
                    <p className="text-gray-400">{inquiry.response}</p>
                  </div>
                )}
                {user?.role === 'owner' && inquiry.status === 'pending' && (
                  <div className="mt-4">
                    {responding === inquiry._id ? (
                      <div>
                        <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Type your response..." className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg mb-2 text-gray-200" rows="3" />
                        <div className="flex space-x-2">
                          <button onClick={() => handleRespond(inquiry._id)} className="btn-primary">Send</button>
                          <button onClick={() => { setResponding(null); setResponseText(''); }} className="btn-secondary">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setResponding(inquiry._id)} className="btn-primary">Respond</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInquiries;