const mongoose = require('mongoose');
const { logError } = require('../utils/Logger'); 

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URL;

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    logError(error);
  }
};

module.exports = connectDB;
