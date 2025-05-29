import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  role: String,
  // Add this username field with unique constraint
  username: {
    type: String,
    unique: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
