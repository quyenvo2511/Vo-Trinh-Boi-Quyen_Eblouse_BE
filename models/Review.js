/**
 * Author: Quyen Vo
 * File name: Review.js
 * Last Date Modified: 16/2/2021
 * Purpose: Review schema for the app
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Clinic = require("./Clinic");

const reviewSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    clinic: { type: Schema.Types.ObjectId, required: true, ref: "Clinic" },
    content: { type: String, required: true },
    rating: { type: Number, enum: [1, 2, 3, 4, 5] },
  },
  { timestamp: true }
);

// This function below is calculating the REVIEWS that CLINIC had.
reviewSchema.statics.calculateReviews = async function (clinicId) {
  const reviewCount = await this.find({ clinic: clinicId }).countDocuments();
  await Clinic.findByIdAndUpdate(clinicId, { reviewCount: reviewCount });
};

//  this function below is calculating the RATING of REVIEWS
reviewSchema.statics.calculateAvgRating = async function (clinicId) {
  const stats = await this.aggregate([
    { $match: { clinic: clinicId } },
    {
      $group: {
        _id: "clinic",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Clinic.findByIdAndUpdate(clinicId, { avgRating: stats[0].avgRating });
};

reviewSchema.post("save", async function () {
  await this.constructor.calculateReviews(this.clinic);
  await this.constructor.calculateAvgRating(this.clinic);
});
// //  before request for calculate reiew, it needs to go through middlewares like belows

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});
// after pre, it needs to post to update again in database

reviewSchema.post(/^findOneAnd/, async function (next) {
  if (this.doc) await this.doc.constructor.calculateReviews(this.doc.clinic);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
