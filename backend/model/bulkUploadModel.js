const mongoose = require("mongoose");

const bulkUploadSchema = new mongoose.Schema({
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  email: { type: String, required: true }, // Add email field
  date: { type: Date, default: Date.now },
  filename: { type: String, required: true },
  duplicateCount: { type: Number, default: 0 },
  netNewCount: { type: Number, default: 0 },
  newEnrichedCount: { type: Number, default: 0 },
  creditUsed: { type: Number, default: 0 },
  remainingCredits: { type: Number, default: 0 },
});

module.exports = mongoose.model("BulkUpload", bulkUploadSchema);
