const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    id: String,
    location: String,
    password: String,
    skills: [],
    role: String,
    refreshToken: String,
    title: String,
    description: String,
    mobile: String,
    name: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", User);
