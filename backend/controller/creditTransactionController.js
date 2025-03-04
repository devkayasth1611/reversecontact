const User = require("../model/userModel");
const CreditTransaction = require("../model/creditTransactionModel");

// Function to update user credits and log the transaction
const updateCredits = async (req, res) => {
  const { userEmail, updatedCredits, transactionType, amount, senderEmail } = req.body; // Ensure senderEmail is received

  try {
    const user = await User.findOne({ userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.credits = updatedCredits;
    await user.save();

    const transaction = new CreditTransaction({
      userEmail,
      senderEmail: senderEmail || "Unknown", // Ensure senderEmail is stored
      transactionType,
      amount,
      remainingCredits: updatedCredits,
    });

    await transaction.save();

    res.status(200).json({ message: "Credits updated successfully." });
  } catch (error) {
    console.error("Error updating credits:", error);
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};




// Function to fetch credit transactions for a user
const getCreditTransactions = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const transactions = await CreditTransaction.find({
      $or: [{ userEmail }, { senderEmail: userEmail }]
    }).sort({ transactionDate: -1 });

    // console.log("Transactions from Database:", transactions); // Debugging  
    res.status(200).json({ data: transactions });
  } catch (error) {
    console.error("Error fetching credit transactions:", error);
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};


module.exports = { updateCredits, getCreditTransactions };
