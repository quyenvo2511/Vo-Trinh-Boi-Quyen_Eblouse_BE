/**
 * Author: Quyen Vo
 * File name: Specialization.js
 * Last Date Modified: 16/2/2021
 * Purpose: Specialization schema for the app
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const specializationSchema = Schema({
  name: { type: String, required: true },
});

const Specialization = mongoose.model("Specialization", specializationSchema);

module.exports = Specialization;
