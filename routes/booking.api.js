/**
 * Author: Quyen Vo
 * File name: booking.api.js
 * Last Date Modified: 16/2/2021
 * Purpose: Routes for operations related to booking.
 */
const express = require("express");
const { param } = require("express-validator");
const router = express.Router();
const clinicController = require("../controllers/clinic.controller");
const validators = require("../middlewares/validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route GET api/booking/:id
 * @description Get all bookings of a clinic given its id
 * @access Public
 */

router.get("/:id", clinicController.getBookingListUser);

/**
 * @route PUT api/booking/:id
 * @description Accept a pending booking request given the id of the current clinic
 * @access Login required
 */
router.put(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  clinicController.acceptBookingRequest
);

/**
 * @route PUT api/booking/manage/:id
 * @description Cancel a booking
 * @access Login required
 */
router.post(
  "/manage/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  clinicController.cancelBookingRequest
);

/**
 * @route POST api/booking/:id
 * @description Create a new booking given an id of the current clinic
 * @access Login required
 */
router.post(
  "/:id",
  authMiddleware.loginRequired,
  userController.createNewBooking
);

module.exports = router;
