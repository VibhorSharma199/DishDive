// /app/api/recipe/deleteRecipe/[id]/route.ts
import { connectDb } from "@/dbconfig/dbConfig"; // Ensure this is the correct path
import { NextRequest, NextResponse } from "next/server";
import Recipe from "@/models/recipeModel.js"; // Ensure this is the correct path
import User from "@/models/userModel";

connectDb();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; // Extract ID from the parameters

    // Check if the recipe exists
    const checkId = await Recipe.findOne({ _id: id });
    if (!checkId) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }
    await User.findByIdAndUpdate(
      checkId.creator,
      { $pull: { uploaded_recipes: checkId._id } }, // Push the new recipe ID into the uploaded_recipes array
      { new: true }
    );
    // Delete the recipe
    await Recipe.deleteOne({ _id: id });

    // Return a success response
    return NextResponse.json(
      { message: "Recipe deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error); // Use console.error for error logging
    return NextResponse.json(
      { message: "Error deleting recipe" },
      { status: 500 }
    );
  }
}
