const express = require("express");
const router = express.Router();
const { getJobs } = require("./jobs.Controller");

router.route("/").get(getJobs);

router.route("/add-job").post();

// router.route("/remove-job").post();

// router.route("/update-job").post();

module.exports = router;
