import dbConnect from "@/lib/db";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    const users = await dbConnect("users");

    const user = await users.findOne({ resetToken: token, resetExpires: { $gt: Date.now() } });
    if (!user) {
      return Response.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
    }

    // Hash new password
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

    // Update password + clear reset token
    await users.updateOne(
      { email: user.email },
      { $set: { password: hashedPassword, salt }, $unset: { resetToken: "", resetExpires: "" } }
    );

    return Response.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Password reset failed" }, { status: 500 });
  }
}
