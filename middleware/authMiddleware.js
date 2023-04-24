const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.json({ status: 0, message: "not sign-in yet" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded._id, "decoded._id");
    req.userId = decoded._id;
    next();
  } catch (error) {
    return res.json({
      status: 0,
      message: "u need to login again because of expired token",
    });
  }
};

module.exports = { verifyToken };
