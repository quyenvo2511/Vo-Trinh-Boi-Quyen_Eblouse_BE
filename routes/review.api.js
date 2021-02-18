/**
 * Author: Quyen Vo
 * File name: review.api.js
 * Last Date Modified: 16/2/2021
 * Purpose: Routes for operations ralated to review
 */
const express = require("express");
const { param } = require("express-validator");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const validators = require("../middlewares/validator");

/**
 * @route POST api/reviews/clinics/:id
 * @description Create a new review for a clinic
 * @access Login required
 */
router.post("/clinic/:id", reviewController.createNewReview);

/**
 * @route GET api/reviews/clinic/:id?page=1&limit=10
 * @description Get reviews of a clinic
 * @access Public
 */
router.get(
  "/clinic/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  reviewController.getReviewsOfClinic
);

/**
 * @route GET api/reviews?page=1&limit=10
 * @description Get all reviews in the database with pagination
 * @access Public
 */
router.get("/", reviewController.getRandomReview);

/**
 * @route PUT api/reviews/:id
 * @description Update a review
 * @access Login required
 */
router.put("/:id", reviewController.updateSingleReview);

/**
 * @route DELETE api/reviews/:id
 * @description Delete a review
 * @access Login required
 */
router.delete("/:id", reviewController.deleteSingleReview);

module.exports = router;
