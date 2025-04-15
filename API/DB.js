const mongoose = require('mongoose');
require('dotenv').config();
//mongodb://127.0.0.1:27017/TaskMaster
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI|| 'mongodb://127.0.0.1:27017/TaskMasterPublic');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
