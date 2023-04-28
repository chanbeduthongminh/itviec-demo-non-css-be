const Jobs = require("./jobs.Model");

const getJobs = async (req, res, next) => {
  try {
    const { skills, title, company, city, limit, skip } = req.query;
    let filter = {};
    // search by title simple -->
    if (title) {
      filter = { ...filter, title: { $regex: title, $options: "i" } };
    }
    // search by title simple <--
    if (skills) {
      filter = { ...filter, skills: { $in: [skills] } };
    }
    // if (company) {
    //   const companyList = await Companies.findOne({
    //     name: { $eq: company.toString() },
    //   });
    //   if (companyList) {
    //     filter = { ...filter, companyId: { $eq: companyList.id } };
    //   }
    // }
    if (city) {
      filter = { ...filter, location: { $eq: city.toString() } };
    }
    const data = await Jobs.list({ filter, limit, skip });
    return res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { getJobs };
