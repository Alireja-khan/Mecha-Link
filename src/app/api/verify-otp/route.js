import dbConnect from "@/lib/db";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    const users = await dbConnect("users");

    const user = await users.findOne({ email });
    if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });

    if (user.otp != parseInt(otp)) 
      return Response.json({ success: false, message: "Invalid OTP" }, { status: 400 });

    // mark verified
    await users.updateOne(
      { email },
      { $set: { status: "verified" }, $unset: { otp: "" } }
    );

    return Response.json({ success: true, message: "Account verified" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return Response.json({ success: false, message: "OTP verification failed" }, { status: 500 });
  }
}