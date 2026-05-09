import mongoose from "mongoose";

export default async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URI);
}