const express = require("express");
const router = express.Router();

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

// bookingApi
const bookingApi = require("./booking.api");
router.use("/bookings", bookingApi);

// auth api
const authApi = require("./auth.api");
router.use("/auth", authApi);

// clinicApi;
const clinicApi = require("./clinic.api");
router.use("/clinic", clinicApi);

// reviewApi;
const reviewApi = require("./review.api");
router.use("/review", reviewApi);

module.exports = router;
