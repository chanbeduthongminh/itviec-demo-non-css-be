const {
  generateToken,
  updateRefreshToken,
} = require("../../config/generateToken");
const User = require("./user.Model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      const newUser = await User.create({
        username: username,
        email: email,
        password: hashed,
      });
      if (newUser) {
        return res
          .status(200)
          .json({ status: 1, message: "Tạo tài khoản thành công" });
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
    const userExist = await User.findOne({ username: { $eq: username } });
    if (!userExist) {
      return res
        .status(200)
        .json({ status: 0, message: "Tài khoản không tồn tại" });
    }
    const validPassword = await bcrypt.compare(password, userExist.password);
    if (!validPassword) {
      return res
        .status(200)
        .json({ status: 0, message: "mật khẩu không chính xác" });
    }

    // const userExist = await User.findOne({
    //   username: username,
    //   password: password,
    // });

    if (userExist && validPassword) {
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

// const login = async (req, res, next) => {
//   const { username, password } = req.body;
//   try {
//     const userExist = await User.findOne({
//       username: username,
//       password: password,
//     });
//     if (userExist) {
//       // const token = jwt.sign(
//       //   { _id: userExist._id },
//       //   process.env.ACCESS_TOKEN_SECRET
//       // );
//       const token = generateToken(userExist);

//       updateRefreshToken(username, token.refreshToken);
//       return res
//         .status(200)
//         .json({ status: 1, message: "Đăng nhập thành công", token: token });
//     } else {
//       console.log("wwrong pass");
//       return res
//         .status(200)
//         .json({ status: 0, message: "Tài khoản hoặc mật khẩu không đúng" });
//     }
//   } catch (error) {
//     res.json({ status: 0, message: error.message });
//   }
// };
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

const checkToken = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: { $eq: req.userId } });
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
  return res.json({ status: 1, message: "Đã đăng xuất thành công" });
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) {
    return res
      .status(200)
      .json({ status: 0, message: "mật khẩu xác nhận sai" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedNewPass = await bcrypt.hash(newPassword, salt);

  const userExist = await User.findOne({ _id: { $eq: req.userId } });

  if (!userExist) {
    return res
      .status(200)
      .json({ status: 0, message: "Tài khoản không tồn tại" });
  }
  const validOldPassword = await bcrypt.compare(
    oldPassword,
    userExist.password
  );

  if (!validOldPassword) {
    return res
      .status(200)
      .json({ status: 0, message: "mật khẩu cũ không chính xác" });
  }

  const updateResult = await User.updateOne(
    { _id: { $eq: req.userId } },
    { $set: { password: hashedNewPass } }
  );
  if (updateResult) {
    return res.json({ status: 1, message: "cập nhật mật khẩu thành công" });
  } else {
    return res.json({ status: 0, message: "cập nhật mật khẩu thất bại" });
  }
};

const userInfo = async (req, res, next) => {
  try {
    const userInformation = await User.findOne({ _id: { $eq: req.userId } });
    if (userInformation) {
      const result = {
        title: userInformation.title,
        description: userInformation.description,
        name: userInformation.name,
        mobile: userInformation.mobile,
        email: userInformation.email,
        location: userInformation.location,
      };
      console.log(result);
      return res.status(200).json({
        status: 1,
        // message: "Kiểm tra thông tin tài khoản",
        result: result,
      });
    } else {
      res.json({
        status: 0,
        message: "Không tìm thấy thông tin tài khoản",
      });
    }
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};
module.exports = {
  registerUser,
  login,
  token,
  checkToken,
  logout,
  changePassword,
  userInfo,
};
