import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://yugenjr847:yugen842007@yugen.zbssgmq.mongodb.net/test?retryWrites=true&w=majority&appName=yugen';
    
    const conn = await mongoose.connect(mongoURI);

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
