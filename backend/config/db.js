import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use MONGO_URI from environment variable
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    const conn = await mongoose.connect(mongoURI, {
      // Modern Mongoose doesn't need these options, but included for compatibility
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB Connected');
    console.log(`📊 Database: ${conn.connection.db.databaseName}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

export default connectDB;
