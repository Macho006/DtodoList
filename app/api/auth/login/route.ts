import { NextResponse } from "next/server";
import {connectToDatabase }from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Bazaga ulanish
    await connectToDatabase();

    // 2. Userni topish
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Bunday foydalanuvchi topilmadi" },
        { status: 400 }
      );
    }

    // 3. Parolni tekshirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Parol noto'g'ri" },
        { status: 400 }
      );
    }

    // 4. Token yaratish
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET .env faylida topilmadi!");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      secret,
      { expiresIn: "7d" }
    );

    // 5. Cookie o'rnatish (Eng to'g'ri usul)
    const response = NextResponse.json({
      message: "Xush kelibsiz!",
      user: { name: user.name, email: user.email },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 kun
      path: "/",
    });

    return response;

  } catch (error: any) {
    console.error("Login Xatosi:", error); // Terminalda xatoni ko'rish uchun
    return NextResponse.json(
      { message: "Serverda xatolik: " + error.message },
      { status: 500 }
    );
  }
}