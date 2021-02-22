/**
 * Author: Quyen Vo
 * File name: user.controller.js
 * Last Date Modified: 16 Feb 2021
 * Purpose: This is the controller to handle user routes
 */
const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/User");
const Booking = require("../models/Booking");
const bcrypt = require("bcryptjs");
const Clinic = require("../models/Clinic");

const userController = {};

/**
 * Register a user given username, email, password, and avatar in the request body
 */
userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password, avatarUrl } = req.body;
  let user = await User.findOne({ email });
  if (user)
    return next(new AppError(400, "User already exists", "Registration Error"));

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({
    name,
    email,
    password,
    avatarUrl,
  });
  const accessToken = await user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});

/**
 * Given a user id, return its detail information
 */
userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  let user = await User.findById(userId);
  let clinic = await Clinic.findById(userId);

  if (!user && !clinic)
    return next(new AppError(400, "User not found", "Get Current User Error"));

  let returnedUser = user ? user.toJSON() : clinic.toJSON();

  // Add another field to indicate whether the returned user is an admin of clinic or not
  if (user) returnedUser.isAdmin = false;
  else returnedUser.isAdmin = true;

  user = returnedUser;

  return sendResponse(res, 200, true, user, null, "Get current user sucessful");
});

/**
 * Get all users in the database
 */
userController.getUsers = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const totalNumUsers = await User.find({ ...filter }).countDocuments();
  const totalPages = Math.ceil(totalNumUsers / limit);
  const offset = limit * (page - 1);

  const users = await User.find({ ...filter })
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(res, 200, true, { users, totalPages }, null, "");
});

/**
 * Create a new booking for a user with a given clinic
 */
userController.createNewBooking = catchAsync(async (req, res, next) => {
  const userID = req.userId;
  const toClinicId = req.params.id;
  const startTime = req.body.startTime;
  const doctor = req.body.doctor;
  const reason = req.body.reason;
  const endTime = req.body.endTime;

  const clinic = await Clinic.findById(toClinicId);
  if (!clinic) {
    return next(
      new AppError(400, "Clinic not found", "Send booking request error")
    );
  }

  await Booking.create({
    user: userID,
    clinic: toClinicId,
    status: "Pending",
    startTime: startTime,
    endTime: endTime,
    doctor: doctor,
    reason: reason,
  });

  return sendResponse(res, 200, true, null, null, "Request has been sent");
});

userController.editProfile = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const { gender, blood, passportNum, job } = req.body;
  const profile = await User.findOneAndUpdate(
    { _id: userId },
    { name, gender, blood, passportNum, job },
    { new: true }
  );
  if (!profile)
    return next(
      new AppError(400, "profile not found", "update information error")
    );
  return sendResponse(res, 200, true, profile, null, "update profile success");
});

module.exports = userController;
