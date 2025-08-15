require('dotenv').config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://yukesshwaran21:Yukessh8072.@cluster0.ob8ygjw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET || 'b7f8c2e1-4a9d-4e2a-8c3f-9d2e6a1b7f8c',
  PORT: process.env.PORT || 5000
};
