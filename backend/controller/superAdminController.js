const SuperAdminTransaction = require("../model/superAdminModel");

// Assign credits to admin
exports.assignCreditsToAdmin = async (req, res) => {
    try {
      const { senderEmail, recipientEmail, amount, remainingCredits } = req.body;
  
      if (!senderEmail || !recipientEmail || !amount) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      const newTransaction = new SuperAdminTransaction({
        senderEmail,
        recipientEmail,
        amount,
        remainingCredits,
      });
  
      await newTransaction.save();
      res.status(200).json({ success: true, message: "Credits assigned successfully", data: newTransaction });
    } catch (error) {
      console.error("Error assigning credits:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

// Get all credit transactions
exports.getCreditTransactions = async (req, res) => {
  try {
    const transactions = await SuperAdminTransaction.find().sort({ date: 1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
