/**
 * Author: Quyen Vo
 * File name: clinic.api.js
 * Last Date Modified: 16/2/2021
 * Purpose: Routes for operations ralated to clinic
 */
const express = require("express");
const { param } = require("express-validator");
const router = express.Router();
const clinicController = require("../controllers/clinic.controller");
const validators = require("../middlewares/validator");

/**
 * @route GET api/clinic/search?query=:category
 * @description Get clinics with query
 * @access Public
 */
router.get("/search", clinicController.getSearchCategory);

/**
 * @route GET api/clinic/specs
 * @description Get all available specializations
 * @access Public
 */
router.get("/specs", clinicController.getAllSpecializations);

/**
 * @route GET api/clinic/:id
 * @description Get single clinic
 * @access Public
 */
router.get(
  "/:id",
  validators.validate([param("id").exists().custom(validators.checkObjectId)]),
  clinicController.getSingleClinic
);

/**
 * @route GET api/clinic?page=1&limit=10&q=:category
 * @description Get clinics with limit, page and query
 * @access Public
 */
router.get("/", clinicController.getListOfClinic);

module.exports = router;
