const express = require('express');
const Transfer = require('../models/Transfer');
const auth = require('../middleware/authMiddleware');
const allow = require('../middleware/rbacMiddleware');

const router = express.Router();

// Create transfer (Admin, Logistic)
router.post('/', auth, allow(['Admin','Logistic']), async (req,res)=>{
  try { res.status(201).json(await Transfer.create(req.body)); }
  catch(e){ res.status(400).json({ error: e.message }); }
});

// List transfers; Commander sees those involving their base
router.get('/', auth, allow(['Admin','Logistic','Commander']), async (req,res)=>{
  const { base, asset, from, to } = req.query;
  const q = {};
  if (asset) q.asset = asset;
  if (from || to) q.date = { ...(from? { $gte: new Date(from) } : {}), ...(to? { $lte: new Date(to) } : {}) };

  if (req.user.role === 'Commander') {
    const b = req.user.base;
    q.$or = [{ fromBase: b }, { toBase: b }];
  } else if (base) {
    q.$or = [{ fromBase: base }, { toBase: base }];
  }

  const items = await Transfer.find(q).populate('fromBase toBase asset').sort({ date: -1 });
  res.json(items);
});

module.exports = router;
