const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token || token === null || token === "null") {
    return res.json({ status: 0, message: "chưa đăng nhập" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded._id;
    req.mess = "token còn hiệu lực";
    next();
  } catch (error) {
    return res.json({
      status: 0,
      message: "token đã hết hạn, cần đăng nhập lại",
    });
  }
};

module.exports = { verifyToken };
