const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const handleUserRegistration = expressAsyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400);
    throw new Error('Please fill out all the fields to register');
  }

  const existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    res.status(400);
    throw new Error('Email id already exists, use another one');
  }

  const hashedPWD = await bcrypt.hash(password, 10);
  console.log('hashedPWD', hashedPWD);

  const addedUser = await userModel.create({
    username: username,
    password: hashedPWD,
    email: email,
  });

  if (addedUser) {
    // Generate a JWT token for the new user
    const payload = { userId: addedUser._id, email: addedUser.email };
    const secretKey = process.env.JWT_SECRET;
    const options = { expiresIn: '1h' };

    const token = jwt.sign(payload, secretKey, options);
    res.status(201).json({
      token,
      message: 'Registration is successful',
      data: addedUser,
    });
  } else {
    res.status(400);
    throw new Error('Something went wrong, please try again');
  }
});

const handleUserLogin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password to log in');
  }

  const user = await userModel.findOne({ email: email });

  if (!user) {
    res.status(400).json({
      message: 'The provided email does not exist in our system !',
    });
  }

  // Check if the password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password !' });
  }

  // Generate a JWT token for the authenticated user
  const payload = { userId: user._id, email: user.email };
  const secretKey = process.env.JWT_SECRET;
  const options = { expiresIn: '1h' };

  const token = jwt.sign(payload, secretKey, options);

  // Return the token and user data in the response
  res.status(200).json({
    token,
    user: { id: user._id, username: user.username, email: user.email },
    message: '🎉 Login successful ! 🥳',
  });
});

const fetchUserDetailsById = expressAsyncHandler(async (req, res) => {
  const id = req?.params?.id;

  if (id !== 'undefined') {
    const requestedUser = await userModel.findById(id);
    if (requestedUser) {
      res.status(200).json(requestedUser);
    } else {
      res.status(400);
      throw new Error('Invalid Id');
    }
  } else {
    res.status(400);
    throw new Error('Id is missing');
  }
});

module.exports = {
  handleUserRegistration,
  handleUserLogin,
  fetchUserDetailsById,
};
