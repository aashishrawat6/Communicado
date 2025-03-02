import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // timsetamps gives cretaedAt, updatedAt
);

const User = mongoose.model("User", userSchema); // mongoose will automatically make user -> users (plural), mongo wants the name's first letter capitalize

export default User;