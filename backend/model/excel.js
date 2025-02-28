const mongoose = require("mongoose");

const ExcelSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Excel", ExcelSchema);
