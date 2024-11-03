import { connectDb } from "@/dbconfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel.js";
connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All feilds are required" },
        { status: 500 }
      );
    }
    const isUser = await User.findOne({ email });
    if (isUser) {
      return NextResponse.json(
        { message: "User already exist" },
        { status: 500 }
      );
    }
    const hashedPass = await bcryptjs.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPass,
    });
    const savedUser = await newUser.save();
    if (savedUser) {
      return NextResponse.json(
        {
          message: "User saved succefully",
          success: true,
          newUser,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
  }
}
