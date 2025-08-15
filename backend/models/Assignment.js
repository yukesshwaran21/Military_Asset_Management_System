const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  personnelName: { type: String, required: true }, // simple text for now
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'AssetType', required: true },
  quantity: { type: Number, required: true, min: 1 },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', schema);
