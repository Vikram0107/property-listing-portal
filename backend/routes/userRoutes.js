const express = require('express');
const {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  updateProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.use(protect);

router.get('/favorites', getFavorites);
router.post('/favorites', addToFavorites);
router.delete('/favorites/:propertyId', removeFromFavorites);
router.put('/profile', upload.single('avatar'), updateProfile);

module.exports = router;