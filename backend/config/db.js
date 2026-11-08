const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inkloom';
    console.log(`Connecting to MongoDB at: ${mongoURI.replace(/\/\/.*@/, '//<credentials>@')}`);
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠️ MongoDB connection warning:', error.message);
    console.warn('Backend will continue running. Ensure MongoDB service or MONGODB_URI is available.');
  }
};

module.exports = connectDB;
