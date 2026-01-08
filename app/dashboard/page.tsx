import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import DashboardUI from "./DashboardUI"; // Yangi komponentni chaqiramiz

interface DecodedToken {
  userId: string;
  email: string;
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/auth");
  }

  let user: DecodedToken | null = null;
  try {
    user = jwt.verify(token.value, process.env.JWT_SECRET!) as DecodedToken;
  } catch (error) {
    redirect("/auth");
  }

  // Server Action (Logout)
  async function logoutAction() {
    "use server";
    (await cookies()).delete("token");
    redirect("/auth");
  }

  // UI ga ma'lumot va funksiyani berib yuboramiz
  return <DashboardUI userEmail={user.email} logoutAction={logoutAction} />;
}