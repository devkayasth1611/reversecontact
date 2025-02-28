const express = require("express");
const multer = require("multer");
const path = require("path");
const Excel = require("../model/excel"); // MongoDB model
const router = express.Router();

// Multer setup to store files in 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Save file route
router.post("/saveFile", upload.single("file"), async (req, res) => {
  try {
    const { userEmail } = req.body;
    const filePath = req.file.path; // File saved in 'uploads' folder

    const newFile = new Excel({
      userEmail,
      fileName: req.file.originalname,
      filePath,
      uploadedAt: new Date(),
    });

    await newFile.save();
    res.status(200).json({ message: "File saved successfully" });
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ message: "Error saving file" });
  }
});

// Fetch user file history
router.get("/history/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;
    const files = await Excel.find({ userEmail }).sort({ uploadedAt: -1 }).limit(5);;

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Error fetching file history" });
  }
});

module.exports = router;
