import { connectDb } from "@/dbconfig/dbConfig.js";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return NextResponse.json(
        { message: "User does not exist", success: false },
        { status: 404 }
      );
    }

    // Compare passwords
    const checkPass = await bcryptjs.compare(password, userExist.password);
    if (!checkPass) {
      return NextResponse.json(
        { message: "Password is incorrect", success: false },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userExist._id,
        username: userExist.username,
        email: userExist.email,
      },
      process.env.JWT_SECRET || "defaultSecret", // Use environment variable for secret
      { expiresIn: "7d" }
    );

    // Prepare response
    const response = NextResponse.json(
      {
        message: "User logged in successfully",
        success: true,
      },
      { status: 200 }
    );

    // Set token in cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return response;
  } catch (error) {
    console.error(error);

    // Handle error types explicitly
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message, success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
