import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGODB_URI as string
    );
    if (connection.readyState === 1) {
      console.log("MongoDB Connected");
      return Promise.resolve(true);
    }
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

connectDB();
