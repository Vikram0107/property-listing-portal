const { createNotification } = require('../controllers/notificationController');

// Add this to authController.js when user registers
await createNotification(
  user._id,
  'welcome',
  'Welcome to PropertyPortal!',
  `Welcome ${user.name}! Start exploring properties and find your dream home.`,
  {}
);