import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.warn("⚠️ WARNING: MONGO_URL is not defined in Environment Variables.");
    console.warn("Please add MONGO_URL in your Render Dashboard > Environment Variables.");
    return;
  }
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB Connected successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("Please ensure your IP is allowed (0.0.0.0/0) in MongoDB Atlas Network Access.");
  }
};
