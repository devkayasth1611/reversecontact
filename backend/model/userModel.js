const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userPassword: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    roleId: {
      type: Number,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String, // Stores the email of the user who added this user
      trim: true,
    },
    credits: {
      type: Number,
      default: 0, // Default credits for a new user
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
