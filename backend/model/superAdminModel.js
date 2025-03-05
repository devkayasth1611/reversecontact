const mongoose = require("mongoose");

const SuperAdminSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true }, // Super Admin Email
  recipientEmail: { type: String, required: true }, // Admin Email
  transactionType: { type: String, default: "Credit Assigned" },
  amount: { type: Number, required: true },
  remainingCredits: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SuperAdminTransaction", SuperAdminSchema);
