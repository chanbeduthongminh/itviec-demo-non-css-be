const jwt = require("jsonwebtoken");
const Users = require("../modules/users/user.Model");

const generateToken = (payload) => {
  const { _id, email } = payload;

  const accessToken = jwt.sign(
    { _id, email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5s",
    }
  );
  const refreshToken = jwt.sign(
    { _id, email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return { accessToken, refreshToken };
};

const updateRefreshToken = async (email, refreshToken) => {
  const users = await Users.findOne({ email: { $eq: email } });
  if (users) {
    users.refreshToken = refreshToken;
    await users.save();
  }
};

module.exports = { generateToken, updateRefreshToken };
