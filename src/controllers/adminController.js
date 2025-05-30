// controllers/adminController.js
import User from "../models/User.js";

export const getRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: "rider" }).select("-googleId"); // Exclude sensitive data
    res.status(200).json(riders);
  } catch (error) {
    res.status(500).json({ error: "Server error: Failed to fetch riders" });
  }
};