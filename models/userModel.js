const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'username is a required field'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'email is a required field'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is a required field'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema); // Capitalize model name (User) conventionally
