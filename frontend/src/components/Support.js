import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaEnvelope, FaClock, FaMapMarkerAlt, FaHeadset } from 'react-icons/fa';

const Support = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const supportDetails = {
    whatsapp: '+91 6356230905',
    email: 'parmarvarshil@outlook.com',
    hours: '24/7 Available',
    location: 'Ahmedabad, India'
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${supportDetails.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${supportDetails.email}`;
  };

  return (
    <>
      {/* Support Button with Tooltip */}
      <div
        className="fixed bottom-6 right-6 z-50"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all relative"
        >
          <FaHeadset className="w-6 h-6" />
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-dark-800 rounded-lg shadow-lg whitespace-nowrap border border-dark-700"
            >
              <p className="text-sm text-gray-200 font-medium">Customer Support</p>
              <p className="text-xs text-gray-400">Click for help</p>
              <div className="absolute bottom-0 right-4 translate-y-1/2 w-2 h-2 bg-dark-800 rotate-45 border-r border-b border-dark-700"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Support Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-dark-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <FaHeadset className="w-6 h-6" />
                    <h3 className="text-2xl font-bold">Support Center</h3>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 text-xl">✕</button>
                </div>
                <p className="mt-2 opacity-90">We're here to help you 24/7</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={handleWhatsApp}
                  className="flex items-center space-x-4 p-4 bg-dark-700 rounded-xl cursor-pointer hover:bg-dark-600 transition-all group"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition">
                    <FaWhatsapp className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200 font-semibold">WhatsApp Support</p>
                    <p className="text-gray-400 text-sm">{supportDetails.whatsapp}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={handleEmail}
                  className="flex items-center space-x-4 p-4 bg-dark-700 rounded-xl cursor-pointer hover:bg-dark-600 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition">
                    <FaEnvelope className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200 font-semibold">Email Support</p>
                    <p className="text-gray-400 text-sm">{supportDetails.email}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>

                <div className="flex items-center space-x-4 p-4 bg-dark-700 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <FaClock className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-gray-200 font-semibold">Support Hours</p>
                    <p className="text-gray-400 text-sm">{supportDetails.hours}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-dark-700 rounded-xl">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-gray-200 font-semibold">Location</p>
                    <p className="text-gray-400 text-sm">{supportDetails.location}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-dark-700 text-center">
                <p className="text-xs text-gray-500">⭐ Response time: Usually within 1 hour</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Support;