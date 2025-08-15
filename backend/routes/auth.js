const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req,res)=>{
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).populate('base');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({
      id: user._id,
      username: user.username,
      role: user.role,
      base: user.base?._id || null
    }, JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, role: user.role, base: user.base?.name || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
