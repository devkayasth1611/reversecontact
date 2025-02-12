const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditTransactionSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    transactionType: {
      type: String, // "add" or "minus"
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    remainingCredits: {
      type: Number,
      required: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CreditTransaction", creditTransactionSchema);
