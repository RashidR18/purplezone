const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register — accepts username + password only
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if username already taken (stored as email field for uniqueness)
    const exists = await User.findOne({ email: username });
    if (exists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName: username,
      email: username,        // username is the unique key
      password: hashedPassword
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login — accepts username (the name used during registration) + password
// We store the name in the `fullName` field and use email as lookup key
// Here we allow login by either fullName or email
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Try finding user by fullName first, then by email
    let user = await User.findOne({ fullName: username });
    if (!user) {
      user = await User.findOne({ email: username });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // If fullName was stored as an email (old registrations), extract the name part
    let displayName = user.fullName;
    if (displayName && displayName.includes('@')) {
      // e.g. "r@gmail.com" → "r"
      displayName = displayName.split('@')[0];
      // Capitalize first letter: "rashid" → "Rashid"
      displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    }

    const token = jwt.sign(
      { id: user._id, fullName: displayName },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      _id: user._id,
      fullName: displayName,
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
