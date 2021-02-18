/**
 * Author: Quyen Vo
 * File name: Clinic.js
 * Last Date Modified: 16/2/2021
 * Purpose: Clinic schema for the app
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const clinicSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  startWorkingTime: { type: String, required: true },
  endWorkingTime: { type: String, required: true },
  languages: [
    {
      type: String,
      enum: ["Vietnamese", "English", "Chinese", "Korean"],
    },
  ],
  registerNumber: { type: String, required: true },
  statement: { type: String, required: true },
  images: [{ type: String, required: true }],
  specializations: [
    { type: Schema.Types.ObjectId, required: true, ref: "Specialization" },
  ],
  services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  doctors: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
  avgRating: { type: Number, default: 0 },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
});

/**
 * Generate an access token for a clinic
 */
clinicSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const Clinic = mongoose.model("Clinic", clinicSchema);
module.exports = Clinic;
