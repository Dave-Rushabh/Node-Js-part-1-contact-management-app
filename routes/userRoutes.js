const express = require('express');
const {
  handleUserRegistration,
  handleUserLogin,
  fetchUserDetailsById,
} = require('../controllers/userControllers');
const validateToken = require('../middleware/tokenValidator');
const userRouter = express.Router();

userRouter.post('/signup', handleUserRegistration);

userRouter.post('/login', handleUserLogin);

// protected route
userRouter.get('/:id', validateToken, fetchUserDetailsById);

module.exports = userRouter;
