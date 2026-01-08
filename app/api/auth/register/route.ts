import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db"; // Oldingi qadamda yaratgan db.ts faylimiz
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Ma'lumotlar to'liq kelganini tekshirish
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Barcha maydonlarni to'ldiring" }, { status: 400 });
    }

    await connectToDatabase();

    // 2. Bunday user oldin bor-yo'qligini tekshirish
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 400 });
    }

    // 3. Parolni shifrlash (Hash)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Yangi foydalanuvchi yaratish
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!", userId: newUser._id }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}
