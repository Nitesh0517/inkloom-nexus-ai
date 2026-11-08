const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, organization } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Please provide name and email' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    user = await User.create({
      name,
      email,
      role: role || 'brand_manager',
      organization: organization || 'Enterprise Brand Lab',
    });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Login user / create token
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      // Auto-create user for demo convenience if email is valid
      user = await User.create({
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email,
        role: email.includes('officer') || email.includes('admin') ? 'compliance_officer' : 'brand_manager',
        organization: 'Acme Brand Holdings',
      });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/demo-login
// @desc    Fast one-click demo login
router.post('/demo-login', async (req, res, next) => {
  try {
    const { role = 'compliance_officer' } = req.body;
    const email = role === 'compliance_officer' ? 'compliance.officer@inkloom.ai' : 'sarah.creator@inkloom.ai';
    const name = role === 'compliance_officer' ? 'Sarah Chen (Lead Brand Governor)' : 'Alex Rivera (Creative Strategist)';

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        role,
        organization: 'Inkloom Global Technologies',
      });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
