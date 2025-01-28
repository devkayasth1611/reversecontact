const BulkUpload = require("../model/bulkUploadModel");

// Add Bulk Upload Entry
exports.addBulkUploadEntry = async (req, res) => {
  try {
    // Validate the data structure
    const {
      filename,
      duplicateCount,
      netNewCount,
      newEnrichedCount,
      creditUsed,
      remainingCredits,
    } = req.body;
    if (
      !filename ||
      !duplicateCount ||
      !netNewCount ||
      !newEnrichedCount ||
      !creditUsed ||
      !remainingCredits
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Log the incoming data for debugging
    console.log("Received bulk upload data:", req.body);

    const bulkUploadData = new BulkUpload(req.body);
    await bulkUploadData.save();

    res
      .status(201)
      .json({
        message: "Bulk upload entry saved successfully",
        data: bulkUploadData,
      });
  } catch (error) {
    console.error("Error saving bulk upload entry:", error);
    res
      .status(500)
      .json({
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
      return res.status(404).json({ message: "No statistics found for this user" });
    }
    res.status(200).json(userStatistics);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: error.message });
  }
};