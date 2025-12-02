import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    Bio: {
      type: String
    },
    DOB: {
      type: String
    },
    Mobile: {
      type: String
    },
    gender: {
      type: String,
      enum: ["Male", "Female"]
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
