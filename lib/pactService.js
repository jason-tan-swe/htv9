import mongoose from "mongoose";
import Pact from "../server/models/pact.js"; // Adjust to the correct path for your Pact model

// Function to get the category count for a specific user
async function getUserCategoryCount(userId) {
  try {
    const categoryCounts = await Pact.aggregate([
      {
        $match: {
          players: new mongoose.Types.ObjectId(userId), // Find pacts where the user is a player
        },
      },
      {
        $group: {
          _id: "$category", // Group by the category field
          count: { $sum: 1 }, // Count the number of pacts per category
        },
      },
    ]);

    return res.status(200).json({ categoryCounts }); // Return array of categories and their counts
  } catch (error) {
    console.error("Error fetching user category count:", error);
    throw error;
  }
}

export { getUserCategoryCount };
