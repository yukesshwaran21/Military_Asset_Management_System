const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const { MONGO_URI, PORT } = require('./config');

const authRoutes = require('./routes/auth');
const baseRoutes = require('./routes/bases');
const assetRoutes = require('./routes/assets');
const purchaseRoutes = require('./routes/purchases');
const transferRoutes = require('./routes/transfers');
const assignmentRoutes = require('./routes/assignments');
const expenditureRoutes = require('./routes/expenditures');
const metricsRoutes = require('./routes/metrics');

const app = express();

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('✅ MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // audit log

app.use('/api/auth', authRoutes);
app.use('/api/bases', baseRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/metrics', metricsRoutes);

// Serve React build in production
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`));
