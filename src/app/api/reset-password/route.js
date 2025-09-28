import dbConnect from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    const users = await dbConnect("users");

    const user = await users.findOne({ resetToken: token });

    if (!user) {
      return Response.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword }, $unset: { resetToken: "" } }
    );

    return Response.json(
      { success: true, message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset Password API Error:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
