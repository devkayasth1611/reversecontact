const userSchema = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.addUser = async (req, res) => {
  const { userEmail, userPassword, roleId } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userPassword, 10); // 10 is the salt rounds

    const user = new userSchema({
      userEmail,
      userPassword: hashedPassword,  // Save the hashed password
      roleId: Number(roleId),         // Ensure roleId is stored as a number
    });

    // Save the user to the database
    const data = await user.save();
    res.status(200).json({
      message: 'User added successfully.',
      data: data,
    });
  } catch (err) {
    res.status(400).json({
      message: 'Something went wrong while adding the user.',
      error: err,
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
