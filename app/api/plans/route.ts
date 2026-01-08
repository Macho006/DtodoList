import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Plan from "@/models/Plan";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { name, steps } = await req.json();

    // 1. Userni aniqlash (Auth)
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) return NextResponse.json({ message: "Ruxsat yo'q" }, { status: 401 });

    const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET!);
    
    // 2. Bazaga ulanish
    await connectToDatabase();

    // 3. Yangi reja yaratish
    const newPlan = await Plan.create({
      userId: decoded.userId,
      name,
      steps,
    });

    return NextResponse.json({ message: "Reja saqlandi!", planId: newPlan._id }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Xatolik yuz berdi" }, { status: 500 });
  }
}