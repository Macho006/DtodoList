import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Iltimos, .env fayliga MONGODB_URI ni qo'shing");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "gritapp_clone",
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};