const jwt = require("jsonwebtoken");
const User = require("../modules/user/User.Model");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    // check if token exist
    if (!token) {
      res.status(401).json({
        error,
        success: false,
        message: "UnAuthorized",
      });
    }

    // if token is valid or not

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const { email } = decoded;

    // check user

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not valid",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      success: false,
      message: error?.message,
    });
  }
};
module.exports = auth;
