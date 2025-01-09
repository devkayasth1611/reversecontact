const userSchema = require('../model/userModel');

exports.addUser = (req, res) => {
  const { userEmail, userPassword } = req.body;
  const user = new userSchema({ userEmail, userPassword });

  user.save()
    .then((data) => {
      if (!data) {
        res.status(400).json({
          message: 'Something went wrong while adding the user.',
        });
      } else {
        res.status(200).json({
          message: 'User added successfully.',
          data: data,
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: 'Something went wrong while adding the user.',
        error: err,
      });
    });
};

exports.getUser = (req, res) => {
  userSchema.find()
    .then((data) => {
      if (!data) {
        res.status(400).json({
          message: 'Something went wrong while fetching the user.',
        });
      } else {
        res.status(200).json({
          message: 'User fetched successfully.',
          data: data,
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: 'Something went wrong while fetching the user.',
        error: err,
      });
    });
};

exports.loginUser = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    // Check if user exists
    const user = await userSchema.findOne({ userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords (assuming plain-text for now)
    if (user.userPassword !== userPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Respond with user data
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.userEmail,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};