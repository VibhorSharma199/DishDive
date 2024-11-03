import mongoose from "mongoose";

export async function connectDb() {
  try {
    mongoose.connect(
      "mongodb+srv://CodeAlphaTaso:Vibhu30@codealphatasks.v4ial.mongodb.net/recipe"
    );
    const connection = mongoose.connection;
    connection.on("connect", () => {
      console.log("Connected");
    });
    connection.on("error", (error) => {
      console.log(error);
      process.exit();
    });
  } catch (error) {
    console.log(error);
  }
}
