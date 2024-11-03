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

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 } // Changed to 400 Bad Request
      );
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return NextResponse.json(
        { message: "User does not exist", success: false },
        { status: 404 } // Changed to 404 Not Found
      );
    }

    const checkPass = await bcryptjs.compare(password, userExist.password);
    if (!checkPass) {
      return NextResponse.json(
        { message: "Password is incorrect", success: false },
        { status: 401 } // Changed to 401 Unauthorized
      );
    }

    const token = await jwt.sign(
      {
        id: userExist._id,
        username: userExist.username,
        email: userExist.email,
      },
      process.env.JWT_SECRET || "recipe", // Use environment variable for secret
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        message: "User logged in successfully",
        success: true, // Added success field
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure only in production
      sameSite: "strict", // Optional, but recommended for security
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 } // Return a 500 for unexpected errors
    );
  }
}
