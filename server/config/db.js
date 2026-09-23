const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';
  
  try {
    // Attempt standard connection to the provided MongoDB URI
    console.log(`Connecting to MongoDB at: ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to fallback if no daemon is listening
    });
    console.log(`MongoDB Connected successfully (${mongoose.connection.host})`);
  } catch (err) {
    console.warn(`Could not connect to external MongoDB at ${uri} (${err.message}).`);
    console.log('Starting embedded MongoDB Memory Server for local development/offline mode...');
    
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`Embedded MongoDB Memory Server connected successfully at ${memoryUri}`);
    } catch (memErr) {
      console.error('Fatal Error: Failed to start embedded MongoDB Memory Server:', memErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('MongoDB disconnected.');
  } catch (error) {
    console.error('Error during MongoDB disconnect:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
