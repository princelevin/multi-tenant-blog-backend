const express = require('express');
const router = express.Router();
const { User } = require('../models');   // load the User model
const bcrypt = require('bcrypt');        // to hash and compare passwords
const jwt = require('jsonwebtoken');     // to create token for login
const authMiddleware = require('../middleware/auth');


// 🔐 POST /register - create a new user
router.post('/register', async (req, res) => {
  const { name, email, password, tenantId } = req.body;
  try {
    const user = await User.create({ name, email, password, tenantId });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password, tenantId } = req.body;
  try {
    const user = await User.findOne({ where: { email, tenantId } });
    if (!user) return res.status(404).json({ error: 'User not found in this tenant' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, tenantId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔒 Protected route
router.get('/profile', authMiddleware, async (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    user: req.user
  });
});

router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      where: { tenantId: req.user.tenantId },
      attributes: ['id', 'name', 'email', 'tenantId'] // don’t include password!
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
