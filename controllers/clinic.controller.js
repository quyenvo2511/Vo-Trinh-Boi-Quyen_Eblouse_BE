/**
 * Author: Quyen Vo
 * Last Date Modified: 16/2/2021
 * File name: clinic.controller.js
 * Purpose: Controller to handle clinic routes
 */
const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Clinic = require("../models/Clinic");
const Review = require("../models/Review");
const Specialization = require("../models/Specialization");
const Booking = require("../models/Booking");

const clinicController = {};

/**
 * Given a specialization in the request query, return an array of clinics
 * that have that specialization
 */
clinicController.getSearchCategory = catchAsync(async (req, res, next) => {
  let { specialization } = { ...req.query };
  specialization = decodeURIComponent(specialization);
  let allClinics = await Clinic.find()
    .populate("specializations")
    .populate("services");
  let clinics = allClinics.filter((clinic) => {
    let specs = clinic.specializations;

    for (let i = 0; i < specs.length; i++) {
      if (specs[i].name.toLowerCase() === specialization.toLowerCase())
        return true;
    }
    return false;
  });
  return sendResponse(res, 200, true, clinics, null, "");
});

/**
 * Given a clinic id, return the details of that clinic
 */
clinicController.getSingleClinic = catchAsync(async (req, res, next) => {
  let clinic = await Clinic.findById(req.params.id)
    .populate({
      path: "doctors",
      populate: [
        { path: "qualification", model: "Qualification" },
        { path: "specialization", model: "Specialization" },
      ],
    })
    .populate("specializations")
    .populate("services");
  clinic = clinic.toJSON();
  if (!clinic)
    return next(
      new AppError(404, "clinic not found", " Get single clinic Error")
    );
  clinic.reviews = await Review.find({ clinic: clinic._id }).populate("user");
  return sendResponse(
    res,
    200,
    true,
    clinic,
    null,
    "get single clinic success"
  );
});

/**
 * Return a list of clinics
 */
clinicController.getListOfClinic = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const totalClinic = await Clinic.countDocuments({ ...filter });
  const totalPages = Math.ceil(totalClinic / limit);
  const offset = limit * (page - 1);

  const clinics = await Clinic.find({ filter })
    .sort({ ...sortBy, createAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("specialization");

  return sendResponse(
    res,
    200,
    true,
    { clinics, totalClinic, totalPages },
    null,
    "get list of Clinic success"
  );
});

/**
 * Accept a pending booking (only apply to admin users)
 */
clinicController.acceptBookingRequest = catchAsync(async (req, res, next) => {
  const bookingId = req.params.id; //From
  console.log(bookingId);
  let bookingRelate = await Booking.findOne({
    _id: bookingId,
    status: "Pending",
  });
  if (!bookingRelate) {
    return next(
      new AppError(
        404,
        "Booking request not found",
        "accept Booking request Error"
      )
    );
  }
  bookingRelate.status = "Accepted";
  await bookingRelate.save();
  return sendResponse(res, 200, true, null, null, "Booking has been accepted");
});

/**
 * Cancel a pending or active booking (only apply to admin users)
 */
clinicController.cancelBookingRequest = catchAsync(async (req, res, next) => {
  const bookingId = req.params.id; //From
  let bookingRelate = await Booking.findOne({
    _id: bookingId,
    $or: [{ status: "Pending" }, { status: "Accepted" }],
  });
  if (!bookingRelate) {
    return next(
      new AppError(
        404,
        "Booking request not found",
        "cancel Booking request Error"
      )
    );
  }
  bookingRelate.status = "Cancelled";
  await bookingRelate.save();
  return sendResponse(res, 200, true, null, null, "Booking has been cancelled");
});

/**
 * Return all bookings related to a clinic
 */
clinicController.getBookingListUser = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };
  const currentUser = req.params.id;

  let bookingRelate = await Booking.find({
    $or: [{ user: currentUser }, { clinic: currentUser }],
  })
    .populate("doctor")
    .populate("user")
    .populate({ path: "clinic", populate: { path: "specializations" } });

  return sendResponse(res, 200, true, bookingRelate, null, null);
});

/**
 * Return all specializations available across all clinics
 */
clinicController.getAllSpecializations = catchAsync(async (req, res, next) => {
  let specializations = await Specialization.find({});
  return sendResponse(
    res,
    200,
    true,
    specializations,
    null,
    "get all specializations success"
  );
});

module.exports = clinicController;
