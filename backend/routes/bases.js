const express = require('express');
const Base = require('../models/Base');
const auth = require('../middleware/authMiddleware');
const allow = require('../middleware/rbacMiddleware');

const router = express.Router();

// Create base (Admin only)
router.post('/', auth, allow(['Admin']), async (req,res)=>{
  try { res.status(201).json(await Base.create(req.body)); }
  catch(e){ res.status(400).json({ error: e.message }); }
});

// List bases (all roles)
router.get('/', auth, allow(['Admin','Commander','Logistic']), async (req,res)=>{
  res.json(await Base.find().sort('name'));
});

module.exports = router;
