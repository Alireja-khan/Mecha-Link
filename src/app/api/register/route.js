import dbConnect from "@/lib/db";
import nodemailer from "nodemailer";
import { hashPassword } from "@/lib/password";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) 
      return Response.json({ success: false, message: "All fields required" }, { status: 400 });

    const users = await dbConnect("users");

    // check if user exists
    const existing = await users.findOne({ email });
    if (existing) return Response.json({ success: false, message: "User already exists" }, { status: 400 });

    // hash password
    const { salt, hashed } = hashPassword(password);

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // save user as pending
    await users.insertOne({
      name,
      email,
      password: hashed,
      salt,
      otp,
      status: "pending",
      createdAt: new Date(),
    });

    // send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account - OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return Response.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    return Response.json({ success: false, message: "Failed to register" }, { status: 500 });
  }
}
