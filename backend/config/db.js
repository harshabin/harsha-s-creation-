const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.trim() === '') {
      console.log('⚡ No external MONGO_URI specified. Starting embedded MongoMemoryServer...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`📦 Embedded MongoDB initialized at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If external mongo failed, fallback to memory server
    if (!mongoServer) {
      console.log('🔄 Attempting fallback to embedded MongoMemoryServer...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ Fallback Embedded MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (fallbackErr) {
        console.error(`❌ Fallback MongoDB Error: ${fallbackErr.message}`);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
