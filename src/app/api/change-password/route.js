import dbConnect, { collections } from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { auth } from "@/auth"; 

export async function POST(req) {
  try {
    // Get session from auth
    const session = await auth(); 
    if (!session?.user?.email) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await req.json();
    const users = await dbConnect(collections.users);

    const user = await users.findOne({ email: session.user.email });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return Response.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await users.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    return Response.json(
      { success: true, message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change Password API Error:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
