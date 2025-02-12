const User = require("../model/userModel");
const CreditTransaction = require("../model/creditTransactionModel");

// Function to update user credits and log the transaction
const updateCredits = async (req, res) => {
  const { userEmail, updatedCredits, transactionType, amount } = req.body;

  try {
    const user = await User.findOne({ userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user credits in the database
    user.credits = updatedCredits;
    await user.save();

    // Log the credit transaction
    const transaction = new CreditTransaction({
      userEmail,
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
    const transactions = await CreditTransaction.find({ userEmail }).sort({ transactionDate: -1 });

    res.status(200).json({ data: transactions });
  } catch (error) {
    console.error("Error fetching credit transactions:", error);
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};

module.exports = { updateCredits, getCreditTransactions };
