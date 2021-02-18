/**
 * Author: Quyen Vo
 * File name: Service.js
 * Last Date Modified: 16/2/2021
 * Purpose: Service schema for the app
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = Schema({
  name: { type: String, required: true },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
