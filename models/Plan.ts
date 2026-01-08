import mongoose, { Schema, Document } from "mongoose";

// Bitta qadam (Step) tuzilmasi
const StepSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  duration: { type: Number, required: true }, // Sekundlarda
  type: { type: String, enum: ["work", "rest"], default: "work" },
});

export interface IPlan extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  steps: {
    title: string;
    description: string;
    duration: number;
    type: "work" | "rest";
  }[];
  createdAt: Date;
}

const PlanSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  steps: [StepSchema], // Qadamlar ro'yxati
  createdAt: { type: Date, default: Date.now },
});

const Plan = mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema);
export default Plan;