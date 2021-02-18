/**
 * Author: Quyen Vo
 * File name: Booking.js
 * Last Date Modified: 16/2/2021
 * Purpose: Booking schema for the app
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    doctor: { type: Schema.Types.ObjectId, required: true, ref: "Doctor" },
    clinic: { type: Schema.Types.ObjectId, required: true, ref: "Clinic" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Cancelled", "Done"],
    },
    reason: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
