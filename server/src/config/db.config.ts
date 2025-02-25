import mongoose from 'mongoose';

const connectDB = async () => {
  try {

    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGO_URI is missing in .env file");
      console.log(`  `);
      process.exit(1);
    }

    mongoose
    .connect(process.env.MONGODB_URI, { dbName: "eduPortalLMS" })
    .then(() => console.log("✅ MongoDB Connected ..."))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;