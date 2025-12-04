import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas
 * This connection string works with both:
 * - MongoDB Atlas cloud
 * - MongoDB Compass desktop application
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ doesn't need these options anymore, but including for clarity
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(`🔗 Connection Ready State: ${conn.connection.readyState}`);
    console.log(`💡 You can view this database in MongoDB Compass using the same connection string\n`);

    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('\n🛑 MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please check:');
    console.error('  1. Your internet connection');
    console.error('  2. MongoDB Atlas cluster is running');
    console.error('  3. IP address is whitelisted in Atlas');
    console.error('  4. Connection string credentials are correct\n');
    process.exit(1);
  }
};

export default connectDB;
