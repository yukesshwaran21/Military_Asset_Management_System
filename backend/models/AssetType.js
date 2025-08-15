const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: String,
  unit: { type: String, default: 'units' }
}, { timestamps: true });

module.exports = mongoose.model('AssetType', schema);
