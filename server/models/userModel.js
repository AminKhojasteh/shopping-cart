import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpiredAt: {
      type: Date,
      default: null,
    },
    verificationCode: String,
    verificationCodeExpiresAt: Date,
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
