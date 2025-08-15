const express = require('express');
const Assignment = require('../models/Assignment');
const auth = require('../middleware/authMiddleware');
const allow = require('../middleware/rbacMiddleware');

const router = express.Router();

// Create assignment (Admin, Commander)
router.post('/', auth, allow(['Admin','Commander']), async (req,res)=>{
  try {
    // If Commander, force assignment to own base
    const payload = { ...req.body };
    if (req.user.role === 'Commander') payload.base = req.user.base;
    res.status(201).json(await Assignment.create(payload));
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
});

// List assignments
router.get('/', auth, allow(['Admin','Commander']), async (req,res)=>{
  const { base, asset, from, to } = req.query;
  const q = {};
  if (asset) q.asset = asset;
  if (req.user.role === 'Commander') q.base = req.user.base;
  if (base) q.base = base;
  if (from || to) q.date = { ...(from? { $gte: new Date(from) } : {}), ...(to? { $lte: new Date(to) } : {}) };

  const items = await Assignment.find(q).populate('base asset').sort({ date: -1 });
  res.json(items);
});

module.exports = router;
