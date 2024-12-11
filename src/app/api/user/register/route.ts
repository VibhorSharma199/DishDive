import { connectDb } from "@/dbconfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel.js";
import validator from "validator";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const isUser = await User.findOne({ email });
    if (isUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPass = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPass,
    });

    // Save the user
    const savedUser = await newUser.save();

    if (savedUser) {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { password, ...userWithoutPassword } = savedUser.toObject(); // Exclude password
      return NextResponse.json(
        {
          message: "User saved successfully",
          success: true,
          user: userWithoutPassword,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error occurred");
      return NextResponse.json(
        { message: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
