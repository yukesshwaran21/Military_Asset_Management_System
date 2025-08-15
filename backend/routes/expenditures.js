const express = require('express');
const Expenditure = require('../models/Expenditure');
const auth = require('../middleware/authMiddleware');
const allow = require('../middleware/rbacMiddleware');

const router = express.Router();

// Record expenditure (Admin, Commander)
router.post('/', auth, allow(['Admin','Commander']), async (req,res)=>{
  try {
    const payload = { ...req.body };
    if (req.user.role === 'Commander') payload.base = req.user.base;
    res.status(201).json(await Expenditure.create(payload));
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
});

// List expenditures
router.get('/', auth, allow(['Admin','Commander','Logistic']), async (req,res)=>{
  const { base, asset, from, to } = req.query;
  const q = {};
  if (asset) q.asset = asset;
  if (req.user.role === 'Commander') q.base = req.user.base;
  if (base) q.base = base;
  if (from || to) q.date = { ...(from? { $gte: new Date(from) } : {}), ...(to? { $lte: new Date(to) } : {}) };

  const items = await Expenditure.find(q).populate('base asset').sort({ date: -1 });
  res.json(items);
});

module.exports = router;
