import dbConnect from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const users = await dbConnect("users");

    const user = await users.findOne({ email });
    if (!user) {
      return Response.json({ success: false, message: "User not found" });
    }

    if (user.status !== "verified") {
      return Response.json({ success: false, message: "Account not verified" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return Response.json({ success: false, message: "Invalid password" });
    }

    return Response.json({
      success: true,
      message: "Login successful",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return Response.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
