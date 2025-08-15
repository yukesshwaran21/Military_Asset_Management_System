const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');
const User = require('./models/User');
const Base = require('./models/Base');
const AssetType = require('./models/AssetType');

(async ()=>{
  await mongoose.connect(MONGO_URI);
  console.log('Seeding...');

  const [alpha, bravo] = await Base.create([
    { name: 'Alpha Base', location: 'Sector A' },
    { name: 'Bravo Base', location: 'Sector B' }
  ]);

  const [rifle, vehicle, ammo] = await AssetType.create([
    { name: 'Rifle', category: 'Weapon', unit: 'pcs' },
    { name: 'APC', category: 'Vehicle', unit: 'pcs' },
    { name: '5.56mm', category: 'Ammunition', unit: 'rounds' }
  ]);

  await User.create([
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'cmdr', password: 'cmdr123', role: 'Commander', base: alpha._id },
    { username: 'logi', password: 'logi123', role: 'Logistic', base: bravo._id }
  ]);

  console.log('Seed complete. Admin: admin/admin123');
  await mongoose.disconnect();
  process.exit(0);
})().catch(e=>{ console.error(e); process.exit(1); });
