const express = require('express');
const protect = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  userProfile,
  getPreferences,
  updatePreferences,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, userProfile); 
router.get('/preferences', protect, getPreferences);
router.post('/preferences', protect, updatePreferences);

module.exports = router;
