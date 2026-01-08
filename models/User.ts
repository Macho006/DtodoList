import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Email takrorlanmasligi kerak
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Modelni qayta yuklashni oldini olish uchun tekshiruv
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;