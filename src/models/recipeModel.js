import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: [
      {
        type: String,
        required: true,
      },
    ],
    instructions: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Appetizer",
        "Main Course",
        "Dessert",
        "Snack",
        "Drink",
        "Salad",
        "Soup",
        "Vegan",
        "Vegetarian",
        "Gluten-Free",
        "Keto",
        "Paleo",
      ],
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isDeleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    recommendations: [
      {
        recipe: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Recipe",
        },
        reason: {
          type: String,
        },
      },
    ],
    spoonacularData: {
      nutrition: {
        calories: Number,
        protein: String,
        fat: String,
        carbs: String,
      },
      prepTime: Number,
      servings: Number,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

recipeSchema.index({
  title: "text",
  ingredients: "text",
  instructions: "text",
  tags: "text",
});

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

export default Recipe;
