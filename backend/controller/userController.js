const userSchema = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.addUser = async (req, res) => {
  const { userEmail, userPassword, companyName, phoneNumber, roleId } = req.body;

  if (!userEmail || !userPassword || !companyName || !phoneNumber) {
    return res.status(400).json({ message: "All fields are mandatory." });
  }

  try {
    // Check for duplicate user
    const existingUser = await userSchema.findOne({ userEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Create a new user
    const user = new userSchema({
      userEmail,
      userPassword: hashedPassword,
      companyName,
      phoneNumber,
      roleId: parseInt(roleId, 10),
    });

    const data = await user.save(); // Save user to DB
    res.status(200).json({
      message: "User added successfully.",
      data: data,
    });
  } catch (err) {
    console.error("Error while adding user:", err); // Debugging
    res.status(500).json({
      message: "Something went wrong while adding the user.",
      error: err.message,
    });
  }
};

exports.addNewUser = async (req, res) => {
  const { userEmail, userPassword, roleId } = req.body;

  if (!userEmail || !userPassword) {
    return res.status(400).json({ message: "All fields are mandatory." });
  }

  try {
    // Check for duplicate user
    const existingUser = await userSchema.findOne({ userEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Create a new user
    const user = new userSchema({
      userEmail,
      userPassword: hashedPassword,
      roleId: parseInt(roleId, 10),
    });

    const data = await user.save(); // Save user to DB
    res.status(200).json({
      message: "User added successfully.",
      data: data,
    });
  } catch (err) {
    console.error("Error while adding user:", err); // Debugging
    res.status(500).json({
      message: "Something went wrong while adding the user.",
      error: err.message,
    });
  }
};


exports.getUser = (req, res) => {
  userSchema.find({ roleId: 2 })
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({
          message: 'No users found with roleId = 2.',
        });
      }
      return res.status(200).json({
        message: 'Users fetched successfully.',
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Error fetching users.',
        error: err.message,
      });
    });
};



exports.loginUser = async (req, res) => {
  // console.log(req.body);  // This will log the body to ensure it's being received correctly

  try {
    const { userEmail, userPassword } = req.body;

    const user = await userSchema.findOne({ userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password securely (bcrypt will compare hashed password)
    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token if credentials are correct
    const token = jwt.sign(
      { id: user._id, email: user.userEmail },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.userEmail,
        roleId: user.roleId,  // Send roleId back with the response
      },
    });
  } catch (error) {
    console.error('Login error:', error); // Log the error to get more details
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};
