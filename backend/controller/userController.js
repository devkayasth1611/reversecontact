const userSchema = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Add User
exports.addUser = async (req, res) => {
  const { userEmail, userPassword, companyName, phoneNumber, roleId } = req.body;

  if (!userEmail || !userPassword || !companyName || !phoneNumber) {
    return res.status(400).json({ message: "All fields are mandatory." });
  }

  try {
    const existingUser = await userSchema.findOne({ userEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const user = new userSchema({
      userEmail,
      userPassword: hashedPassword,
      companyName,
      phoneNumber,
      roleId: parseInt(roleId, 10),
    });

    const data = await user.save();
    res.status(200).json({
      message: "User added successfully.",
      data,
    });
  } catch (err) {
    console.error("Error while adding user:", err);
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
};

// Add New User with Credits
exports.addNewUser = async (req, res) => {
  const { userEmail, userPassword, roleId, createdBy, credits } = req.body;

  if (!userEmail || !userPassword || !createdBy) {
    return res.status(400).json({ message: "All fields are mandatory." });
  }

  try {
    const existingUser = await userSchema.findOne({ userEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const user = new userSchema({
      userEmail,
      userPassword: hashedPassword,
      roleId: parseInt(roleId, 10),
      createdBy,
      credits: credits || 1000, // Default to 1000 if not provided
    });

    const data = await user.save();
    res.status(200).json({ message: "User added successfully.", data });
  } catch (err) {
    console.error("Error while adding user:", err);
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
};

// Update Credits
exports.updateCredits = async (req, res) => {
  const { userEmail, credits } = req.body;

  if (!userEmail || credits == null) {
    return res.status(400).json({ message: "Email and credits are required." });
  }

  try {
    const updatedUser = await userSchema.findOneAndUpdate(
      { userEmail },
      { credits },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Credits updated successfully.", updatedUser });
  } catch (error) {
    console.error("Error updating credits:", error);
    res.status(500).json({ message: "Failed to update credits.", error: error.message });
  }
};

// Get Users with roleId = 2
exports.getUser = async (req, res) => {
  try {
    const users = await userSchema.find({ roleId: 2 });

    if (!users.length) {
      return res.status(404).json({ message: "No users found with roleId = 2." });
    }

    res.status(200).json({ message: "Users fetched successfully.", data: users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users.", error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const user = await userSchema.findOne({ userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.userEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        email: user.userEmail,
        roleId: user.roleId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
