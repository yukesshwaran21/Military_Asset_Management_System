const express = require('express');
const Purchase = require('../models/Purchase');
const auth = require('../middleware/authMiddleware');
const allow = require('../middleware/rbacMiddleware');

const router = express.Router();

// Create purchase (Admin, Logistic)
router.post('/', auth, allow(['Admin','Logistic']), async (req,res)=>{
  try { res.status(201).json(await Purchase.create(req.body)); }
  catch(e){ res.status(400).json({ error: e.message }); }
});

// List purchases (filter by base/asset/date); Commander limited to own base
router.get('/', auth, allow(['Admin','Logistic','Commander']), async (req,res)=>{
  const { base, asset, from, to } = req.query;
  const q = {};
  if (base) q.base = base;
  if (asset) q.asset = asset;
  if (from || to) q.date = { ...(from? { $gte: new Date(from) } : {}), ...(to? { $lte: new Date(to) } : {}) };
  if (req.user.role === 'Commander' && !q.base) q.base = req.user.base;
  const items = await Purchase.find(q).populate('base asset').sort({ date: -1 });
  res.json(items);
});

module.exports = router;
