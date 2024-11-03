// dbConfig.js
import { connectDb } from "@/dbconfig/dbConfig"; // Ensure this is the correct path
import { NextRequest, NextResponse } from "next/server";
import Recipe from "@/models/recipeModel.js"; // Ensure this is the correct path
import User from "@/models/userModel.js"; // Ensure you import your User model
import jwt, { JwtPayload } from "jsonwebtoken"; // Ensure you have jwt installed

// Connect to the database
connectDb();

// POST handler for adding a new recipe
export async function POST(request: NextRequest) {
  try {
    // Extract cookies from the request
    const cookieHeader = request.headers.get("cookie");
    const cookies = cookieHeader
      ? Object.fromEntries(
          cookieHeader.split("; ").map((cookie) => cookie.split("="))
        )
      : {};

    // Retrieve the token from cookies
    const token = cookies.token; // Adjust the key if your cookie name is different

    if (!token) {
      return NextResponse.json(
        { message: "No authorization token provided." },
        { status: 401 }
      );
    }

    // Verify the token and extract user ID
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "recipe"
    ) as JwtPayload; // Assert the type

    if (!decoded.id) {
      return NextResponse.json({ message: "Invalid token." }, { status: 401 });
    }

    const creatorId = decoded.id; // Now TypeScript knows `decoded` is of type JwtPayload

    // Parse the request body as JSON
    const reqBody = await request.json();
    const { title, ingredients, instructions } = reqBody;

    // Validate request body
    if (!title || !ingredients || !instructions) {
      return NextResponse.json(
        { message: "Please fill all fields" },
        { status: 400 }
      );
    }

    // Create a new recipe instance
    const newRecipe = new Recipe({
      title,
      ingredients, // Ensure this matches your schema
      instructions,
      creator: creatorId, // Use the extracted user ID
    });

    // Save the recipe to the database
    await newRecipe.save();

    // Find the user and add the recipe ID to uploaded_recipes
    await User.findByIdAndUpdate(
      creatorId,
      { $push: { uploaded_recipes: newRecipe._id } }, // Push the new recipe ID into the uploaded_recipes array
      { new: true } // Option to return the updated document
    );

    // Return a success response
    return NextResponse.json(
      {
        message: "Recipe created successfully",
        recipe: newRecipe,
        creator: creatorId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error); // Use console.error for error logging
    return NextResponse.json(
      { message: "Error creating recipe" },
      { status: 500 }
    );
  }
}
