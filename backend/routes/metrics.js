const express = require('express');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');
const Expenditure = require('../models/Expenditure');
const auth = require('../middleware/authMiddleware');
const allow = require('../middleware/rbacMiddleware');

const router = express.Router();

// GET /api/metrics?base=&asset=&from=&to=
router.get('/', auth, allow(['Admin','Commander','Logistic']), async (req,res)=>{
  const { base, asset, from, to } = req.query;

  const dateMatch = {};
  if (from) dateMatch.$gte = new Date(from);
  if (to) dateMatch.$lte = new Date(to);

  // Filters per collection
  const filter = (extra = {}) => {
    const f = { ...extra };
    if (asset) f.asset = asset;
    if (Object.keys(dateMatch).length) f.date = dateMatch;
    return f;
  };

  // Apply base restriction for commander for each query
  const baseRestrict = (docKey) => {
    // docKey can be 'base', 'fromBase', 'toBase', or array condition
    if (req.user.role !== 'Commander' || !req.user.base) return {};
    if (docKey === 'either') return { $or: [{ fromBase: req.user.base }, { toBase: req.user.base }] };
    return { [docKey]: req.user.base };
  };

  const [purchases, transfersIn, transfersOut, assignments, expenditures] = await Promise.all([
    Purchase.aggregate([{ $match: { ...filter(base ? { base } : {}), ...baseRestrict('base') } }, { $group: { _id: null, qty: { $sum: '$quantity' } } }]),
    Transfer.aggregate([{ $match: { ...filter(base ? { toBase: base } : {}), ...baseRestrict('toBase') } }, { $group: { _id: null, qty: { $sum: '$quantity' } } }]),
    Transfer.aggregate([{ $match: { ...filter(base ? { fromBase: base } : {}), ...baseRestrict('fromBase') } }, { $group: { _id: null, qty: { $sum: '$quantity' } } }]),
    Assignment.aggregate([{ $match: { ...filter(base ? { base } : {}), ...baseRestrict('base') } }, { $group: { _id: null, qty: { $sum: '$quantity' } } }]),
    Expenditure.aggregate([{ $match: { ...filter(base ? { base } : {}), ...baseRestrict('base') } }, { $group: { _id: null, qty: { $sum: '$quantity' } } }]),
  ]);

  const sum = (arr) => (arr[0]?.qty || 0);
  const totals = {
    purchases: sum(purchases),
    transferIn: sum(transfersIn),
    transferOut: sum(transfersOut),
    assigned: sum(assignments),
    expended: sum(expenditures)
  };

  const netMovement = totals.purchases + totals.transferIn - totals.transferOut;

  // Opening/Closing balances (simple derivation for the period)
  // For initial framework, we assume opening is a provided baseline (0 here).
  const openingBalance = 0;
  const closingBalance = openingBalance + netMovement - totals.expended - totals.assigned;

  res.json({
    openingBalance,
    closingBalance,
    netMovement,
    breakdown: {
      purchases: totals.purchases,
      transferIn: totals.transferIn,
      transferOut: totals.transferOut
    },
    assigned: totals.assigned,
    expended: totals.expended
  });
});

module.exports = router;
