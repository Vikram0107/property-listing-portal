const Favorite = require('../models/Favorite');
const User = require('../models/User');
const Property = require('../models/Property');
const cloudinary = require('cloudinary').v2;

// @desc    Get user favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name email phone' }
      })
      .sort('-createdAt');

    res.json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add to favorites
const addToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      property: propertyId
    });

    if (existingFavorite) {
      return res.status(400).json({ success: false, message: 'Property already in favorites' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId
    });

    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      property: propertyId
    });

    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    // Handle avatar upload
    if (req.file) {
      // Delete old avatar from cloudinary if exists
      if (user.profilePicture) {
        try {
          const publicId = user.profilePicture.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`avatars/${publicId}`);
        } catch (err) {
          console.error('Error deleting old avatar:', err);
        }
      }
      user.profilePicture = req.file.path;
    }

    const updatedUser = await user.save();

    // Generate new token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        profilePicture: updatedUser.profilePicture,
        token: token
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  updateProfile
};