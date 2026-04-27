const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// ─── REGISTER ───────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password before saving
    const hashed = await bcrypt.hash(password, 10);

    // Save new user
    const user = await User.create({ email, password: hashed });

    res.json({ message: 'Registered successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── LOGIN ──────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    // Create a token with user's id inside
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── FORGOT PASSWORD ────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    // Create a short-lived reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Save token to user record
    user.resetToken = resetToken;
    await user.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Click this link to reset your password: ${resetLink}`
    });

    res.json({ message: 'Reset link sent to your email' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── RESET PASSWORD ─────────────────────────────────────
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and check token matches
    const user = await User.findById(decoded.id);
    if (!user || user.resetToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (err) {
    res.status(500).json({ message: 'Token expired or invalid' });
  }
});

module.exports = router;