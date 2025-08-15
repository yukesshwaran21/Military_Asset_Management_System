const express = require('express');
const AssetType = require('../models/AssetType');
const auth = require('../middleware/authMiddleware');
const allow = require('../middleware/rbacMiddleware');

const router = express.Router();

router.post('/', auth, allow(['Admin']), async (req,res)=>{
  try { res.status(201).json(await AssetType.create(req.body)); }
  catch(e){ res.status(400).json({ error: e.message }); }
});

router.get('/', auth, allow(['Admin','Commander','Logistic']), async (req,res)=>{
  res.json(await AssetType.find().sort('name'));
});

module.exports = router;
