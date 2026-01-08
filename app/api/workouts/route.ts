import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Workout from "@/models/Workout"; // Modelni o'zingiz yaratasiz

export async function GET() {
  try {
    await connectToDatabase();
    const workouts = await Workout.find({});
    return NextResponse.json({ success: true, data: workouts });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
  }
}