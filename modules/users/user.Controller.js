const {
  generateToken,
  updateRefreshToken,
} = require("../../config/generateToken");
const User = require("./user.Model");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (username && email && password) {
      // const checkDuplicate = await User.findOne({
      //   $or: [
      //     { username: "chubedan12" },
      //     { email: "chubej121233123ohnwick@gmail.com" },
      //   ],
      // });
      // if (usernameExists) {
      //   res.json({
      //     status: 0,
      //     message:
      //       "Tên đăng nhập hoặc email này đã được đăng ký, vui lòng thử lại",
      //   });
      // }
      const usernameExists = await User.findOne({ username: username });
      if (usernameExists) {
        return res.json({
          status: 0,
          message: "Tên đăng nhập này đã được đăng ký, vui lòng thử lại",
        });
      }
      const userEmailExists = await User.findOne({ email: email });
      if (userEmailExists) {
        return res.json({
          status: 0,
          message: "email này đã được sử dụng, vui lòng thử lại",
        });
      }
      const newUser = await User.create({
        username,
        email,
        password,
      });
      if (newUser) {
        return res.status(200).json("Tạo tài khoản thành công");
      }
    } else {
      res.json({
        status: 0,
        message: "Vui lòng điền hết các trường thông tin",
      });
    }
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const userExist = await User.findOne({
      username: username,
      password: password,
    });
    if (userExist) {
      // const token = jwt.sign(
      //   { _id: userExist._id },
      //   process.env.ACCESS_TOKEN_SECRET
      // );
      const token = generateToken(userExist);

      updateRefreshToken(username, token.refreshToken);
      return res
        .status(200)
        .json({ status: 1, message: "Đăng nhập thành công", token: token });
    } else {
      console.log("wwrong pass");
      return res
        .status(200)
        .json({ status: 0, message: "Tài khoản hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// test
const token = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.json({ hi: "looix1" });
  }
  const userExist = await User.findOne({ refreshToken: { $eq: refreshToken } });
  if (!userExist) {
    return res.json({ hi: "looix2" });
  }
  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const token = generateToken(userExist);
    await updateRefreshToken(userExist.email, refreshToken);
    return res.status(200).json({ token });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

const posts = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: { $eq: req.userId } });
    console.log(user, "user");
    return res
      .status(200)
      .json({ status: 1, message: "thành công", user: user, mess: req.mess });
  } catch (error) {
    return res.json({ status: 0, message: error.message });
  }
};

const logout = async (req, res, next) => {
  const user = await User.findOne({ _id: { $eq: req.userId } });
  await updateRefreshToken(user.email, null);
  console.log(user);
  return res.json(user);
};
module.exports = { registerUser, login, token, posts, logout };
