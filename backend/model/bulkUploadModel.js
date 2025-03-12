const mongoose = require("mongoose");

const bulkUploadSchema = new mongoose.Schema(
  {
    task: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, default: Date.now },
    filename: { type: String, required: true },
    linkUpload:{ type: String},
    duplicateCount: { type: Number, default: 0 },
    netNewCount: { type: Number, default: 0 },
    newEnrichedCount: { type: Number, default: 0 },
    creditUsed: { type: Number, default: 0 },
    remainingCredits: { type: Number, default: 0 },
  }
);

module.exports = mongoose.model("AllStatistic", bulkUploadSchema);
