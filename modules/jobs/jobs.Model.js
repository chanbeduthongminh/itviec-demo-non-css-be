const mongoose = require("mongoose");

const Jobs = mongoose.Schema(
  {
    id: String,
    companyId: String,
    title: String,
    salaryMax: Number,
    skills: Array,
    jobLevel: String,
    location: String,
    address: String,
    mapLink: String,
    postedTime: Number,
    type: String,
    hotJob: Boolean,
    seen: Boolean,
    reasonToJoin: Array,
    description: [
      {
        detail: Array,
      },
      {
        title: String,
        detail: Array,
      },
    ],
    requirements: [
      {
        detail: Array,
      },
    ],
    benefit: Array,
  },
  { timestamps: true }
);

Jobs.statics = {
  async list({ skip = 0, limit = 100, sort = {}, filter = {} }) {
    const [data, count] = await Promise.all([
      this.find(filter).sort(sort).skip(+skip).limit(+limit).exec(),
      this.count(filter),
    ]);
    return { data, count, limit, skip, filter };
  },
};

module.exports = mongoose.model("jobs", Jobs);
