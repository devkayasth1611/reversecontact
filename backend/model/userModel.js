const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    userPassword: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      // required: true, // Set to true if mandatory
      trim: true,
    },
    phoneNumber: {
      type: String,
      // required: true, // Set to true if mandatory
      trim: true,
    },
    roleId: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
