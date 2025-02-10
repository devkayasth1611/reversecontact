const BulkUpload = require("../model/bulkUploadModel");

// Add Bulk Upload Entry
exports.addBulkUploadEntry = async (req, res) => {
  try {
    const {
      task,
      filename,
      duplicateCount = 0,
      netNewCount = 0,
      newEnrichedCount = 0,
      creditUsed = 0,
      remainingCredits = 0,
    } = req.body;

    if (!filename) {
      return res.status(400).json({ message: "Filename is required" });
    }

    const bulkUploadData = new BulkUpload({
      ...req.body,
      duplicateCount,
      netNewCount,
      newEnrichedCount,
      creditUsed,
      remainingCredits,
    });

    await bulkUploadData.save();

    res.status(201).json({
      message: "Bulk upload entry saved successfully",
      data: bulkUploadData,
    });
  } catch (error) {
    console.error("Error saving bulk upload entry:", error);
    res.status(500).json({
      message: "Error saving bulk upload entry",
      error: error.message,
    });
  }
};

// Get All Bulk Upload Statistics
exports.getBulkUploadStatistics = async (req, res) => {
  try {
    const statistics = await BulkUpload.find();
    res.status(200).json(statistics);
  } catch (error) {
    console.error("Error fetching bulk upload statistics:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
};

exports.getUserStatisticsByEmail = async (req, res) => {
  const { email } = req.query; // Extract email from the query parameters

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const userStatistics = await BulkUpload.find({ email }); // Fetch records for the given email
    if (!userStatistics || userStatistics.length === 0) {
      return res
        .status(404)
        .json({ message: "No statistics found for this user" });
    }
    res.status(200).json(userStatistics);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: error.message });
  }
};
