import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Support from './components/Support';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/Profile';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import MyProperties from './pages/MyProperties';
import MyInquiries from './pages/MyInquiries';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
              style: {
                background: '#1f2937',
                borderLeft: '4px solid #10b981',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                background: '#1f2937',
                borderLeft: '4px solid #ef4444',
              },
            },
            loading: {
              style: {
                background: '#1f2937',
                borderLeft: '4px solid #f59e0b',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          <Route path="/add-property" element={<PrivateRoute roles={['owner', 'admin']}><AddProperty /></PrivateRoute>} />
          <Route path="/edit-property/:id" element={<PrivateRoute roles={['owner', 'admin']}><EditProperty /></PrivateRoute>} />
          <Route path="/my-properties" element={<PrivateRoute roles={['owner', 'admin']}><MyProperties /></PrivateRoute>} />
          <Route path="/my-inquiries" element={<PrivateRoute><MyInquiries /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
          <Route path="/admin/*" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        </Routes>
        <Support />
      </AuthProvider>
    </Router>
  );
}

export default App;