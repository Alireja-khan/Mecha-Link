import dbConnect from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const users = await dbConnect("users");

    const user = await users.findOne({ email });
    if (!user) {
      return Response.json({ success: false, message: "Email not found" }, { status: 404 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    // Save token in DB
    await users.updateOne(
      { email },
      { $set: { resetToken, resetExpires } }
    );

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    });

    return Response.json({ success: true, message: "Reset link sent" });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Failed to send reset link" }, { status: 500 });
  }
}
