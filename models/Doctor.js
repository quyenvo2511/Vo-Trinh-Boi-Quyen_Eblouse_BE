/**
 * Author: Quyen Vo
 * File name: Doctor.js
 * Last Date Modified: 16/2/2021
 * Purpose: Doctor schema for the app
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  status: { type: String, enum: ["Working", "On leave"] },
  qualification: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Qualification",
  },
  specialization: [
    { type: Schema.Types.ObjectId, required: true, ref: "Specialization" },
  ],
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
