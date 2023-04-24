const express = require("express");
// const jobsRoutes = require("./modules/allJobs/jobs.Route");
// const companiesRoutes = require("./modules/ITCompanies/companies.Route");
// const countryCodesRoutes = require("./modules/countrycodes/countryCodes.Route");
const userRoutes = require("./modules/users/user.Route");

const router = express.Router();
// router.use("/jobs", jobsRoutes);

// router.use("/companies", companiesRoutes);

// router.use("/country-codes", countryCodesRoutes);

router.use("/users", userRoutes);

module.exports = router;
