import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import axios from '../utils/axios';
import PropertyCard from '../components/PropertyCard';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaHome, FaUserFriends, FaShieldAlt, FaArrowRight, FaChevronRight, FaHeart, FaStar, FaMapMarkerAlt, FaPlusCircle, FaUser } from 'react-icons/fa';

const Home = () => {
  const { user } = useAuth();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const containerRef = useRef(null);

  const words = ['Dream Home', 'Investment', 'Luxury Villa', 'Cozy Apartment', 'Perfect Space'];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    fetchFeaturedProperties();

    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x * 20);
        mouseY.set(y * 20);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await axios.get('/properties?status=approved&sort=newest&limit=6');
      const propertyList = response.data.data || response.data;
      setFeaturedProperties(Array.isArray(propertyList) ? propertyList.slice(0, 6) : []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const floatingElements = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 10,
    delay: Math.random() * 5,
    size: 20 + Math.random() * 60,
    opacity: 0.03 + Math.random() * 0.07,
  }));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 overflow-hidden" ref={containerRef}>
      <Navbar />

      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingElements.map((item) => (
          <motion.div
            key={item.id}
            className="absolute rounded-full bg-gradient-to-r from-primary-500 to-purple-500"
            initial={{ x: `${item.x}%`, y: `${item.y}%`, scale: 0 }}
            animate={{
              y: [`${item.y}%`, `${item.y + 20}%`, `${item.y}%`],
              x: [`${item.x}%`, `${item.x + 10}%`, `${item.x}%`],
              scale: [0, 1, 0],
              opacity: [0, item.opacity, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: item.size,
              height: item.size,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>

      {/* Hero Section with Morphing Effects */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(139,92,246,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Morphing Shape */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderRadius: ['50%', '40% 60% 70% 30% / 40% 50% 60% 50%', '50%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.05) 100%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="text-center"
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center px-4 py-2 bg-primary-500/20 rounded-full mb-6 backdrop-blur-sm"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                🏠
              </motion.span>
              <span className="text-primary-400 text-sm font-medium">Find Your Dream Home</span>
            </motion.div>

            {/* Animated Title */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                Discover Your
              </span>
              <br />
              <motion.span
                key={currentWordIndex}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20, rotateX: 90 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent inline-block"
              >
                {words[currentWordIndex]}
              </motion.span>
            </motion.h1>

            {/* Animated Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            >
              Browse thousands of properties, find your dream home, and connect with owners directly
            </motion.p>

            {/* Animated Buttons - Shows different buttons based on login status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex justify-center space-x-4 flex-wrap gap-4"
            >
              <Link to="/properties">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all flex items-center space-x-2"
                >
                  <FaSearch className="w-5 h-5 group-hover:rotate-12 transition" />
                  <span>Browse Properties</span>
                  <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </motion.button>
              </Link>

              {/* Conditional Button - Show different based on login status */}
              {user ? (
                <Link to={user.role === 'owner' || user.role === 'admin' ? "/add-property" : "/dashboard"}>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all flex items-center space-x-2"
                  >
                    {(user.role === 'owner' || user.role === 'admin') ? (
                      <>
                        <FaPlusCircle className="w-5 h-5 group-hover:rotate-12 transition" />
                        <span>List Your Property</span>
                      </>
                    ) : (
                      <>
                        <FaUser className="w-5 h-5 group-hover:scale-110 transition" />
                        <span>Go to Dashboard</span>
                      </>
                    )}
                  </motion.button>
                </Link>
              ) : (
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-dark-800/80 backdrop-blur-sm border border-dark-700 text-gray-200 rounded-xl font-semibold hover:bg-dark-700 transition-all flex items-center space-x-2"
                  >
                    <FaHome className="w-5 h-5 group-hover:-translate-y-1 transition" />
                    <span>List Your Property</span>
                  </motion.button>
                </Link>
              )}
            </motion.div>

            {/* Floating Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16"
            >
              {[
                { value: '500+', label: 'Active Listings', icon: FaHome, color: 'from-blue-500 to-cyan-500' },
                { value: '50+', label: 'Cities Covered', icon: FaMapMarkerAlt, color: 'from-green-500 to-emerald-500' },
                { value: '1000+', label: 'Happy Clients', icon: FaHeart, color: 'from-red-500 to-pink-500' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-5 text-center border border-dark-700 hover:border-primary-500/50 transition-all"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-200">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Welcome Message for Logged-in Users */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-8"
              >
                <div className="inline-flex items-center space-x-2 px-6 py-3 bg-dark-800/50 rounded-full backdrop-blur-sm border border-dark-700">
                  <span className="text-2xl">👋</span>
                  <span className="text-gray-300">Welcome back,</span>
                  <span className="text-primary-400 font-semibold">{user.name}</span>
                  <span className="text-gray-300">!</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Featured Properties with Stagger Animation */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-primary-500/10 rounded-full mb-4"
          >
            <FaStar className="w-4 h-4 text-primary-400 mr-2" />
            <span className="text-primary-400 text-sm">Featured Listings</span>
          </motion.div>
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-200 mb-3"
          >
            Handpicked Properties
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg"
          >
            Discover our most exclusive listings
          </motion.p>
        </motion.div>

        {featuredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-bounce">🏠</div>
            <p className="text-gray-500">No properties available yet.</p>
            {user && (user.role === 'owner' || user.role === 'admin') && (
              <Link to="/add-property" className="inline-block mt-4 text-primary-400 hover:text-primary-300">
                Be the first to list a property →
              </Link>
            )}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProperties.map((property) => (
              <motion.div
                key={property._id}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -10 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {featuredProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link to="/properties">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition"
              >
                <span>View all properties</span>
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Features with Animated Cards */}
      <div className="bg-dark-800/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-200 mb-3">Why Choose Us</h2>
            <p className="text-gray-400">Experience the difference with our premium service</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaSearch, title: 'Smart Search', desc: 'Advanced filters to find your perfect property', color: 'from-blue-500 to-cyan-500' },
              { icon: FaShieldAlt, title: 'Verified Listings', desc: 'All properties verified by our expert team', color: 'from-green-500 to-emerald-500' },
              { icon: FaUserFriends, title: 'Direct Contact', desc: 'Connect directly with property owners', color: 'from-purple-500 to-pink-500' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-dark-700 hover:border-primary-500/50 transition-all group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}
                >
                  <feature.icon className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3 group-hover:text-primary-400 transition">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA with Parallax Effect */}
      <div className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(59,130,246,0.1) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-3xl p-12 text-center backdrop-blur-sm border border-primary-500/30"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🏠
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-200 mb-3">Ready to find your dream home?</h3>
            <p className="text-gray-400 mb-8">Join thousands of satisfied customers who found their perfect property</p>
            <Link to="/properties">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all inline-flex items-center space-x-2"
              >
                <span>Get Started</span>
                <FaArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating Mouse Trailer */}
      <motion.div
        className="fixed pointer-events-none z-50 hidden md:block"
        style={{
          x: springX,
          y: springY,
          left: 0,
          top: 0,
        }}
      >
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500/20 to-purple-500/20 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

export default Home;