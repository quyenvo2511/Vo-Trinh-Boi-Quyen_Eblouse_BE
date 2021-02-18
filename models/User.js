/**
 * Author: Quyen Vo
 * File name: User.js
 * Last Date Modified: 16/2/2021
 * Purpose: User schema for the app
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, required: false },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    blood: {
      type: String,
      enum: ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"],
    },
    passportNum: { type: String },
    job: { type: String },
  },
  { timestamp: true }
);

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
