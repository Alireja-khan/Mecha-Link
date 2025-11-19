import dbConnect from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const users = await dbConnect("users");

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // ✅ save OTP + expiry in DB
    await users.updateOne(
      { email },
      { $set: { otp, otpExpiresAt: Date.now() + 5 * 60 * 1000 } } // 5 min expiry
    );

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return Response.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
