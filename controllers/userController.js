const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const registerUser = async (req, res) => {
  let { email, password } = req.body;

  
email = email.trim().toLowerCase();

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashed); // ✅ log for debugging

    const user = await User.create({ email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login user
const loginUser = async (req, res) => {
  let { email, password } = req.body;

  // Normalize email
  email = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    console.log("User password in DB:", user.password);      // ✅ for debugging
    console.log("Password provided:", password);              // ✅ for debugging

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc Get user profile
const userProfile = async (req, res) => {
  res.json(req.user);
};

// @desc Get preferences
const getPreferences = async (req, res) => {
  res.json(req.user.preferences);
};

// @desc Update preferences
const updatePreferences = async (req, res) => {
  const { categories, frequency } = req.body;
  try {
    req.user.preferences = { categories, frequency };
    await req.user.save();
    res.json({ message: 'Preferences updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  userProfile,
  getPreferences,
  updatePreferences,
};
