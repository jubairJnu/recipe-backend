/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const AppError = require("../../error/AppError");
const User = require("../users/User.Model");
const SendSMS = require("../../utils/SendSms");
const ResetPassword = require("./ResetPass.model");
require("dotenv").config();

const login = async (payload, deviceInfo) => {
  const isExistUser = await User.findOne({ email: payload?.email });
  // check if use exist or not
  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found !");
  }

  const isActive = isExistUser.status;
  // check if the user is active or not

  if (isActive !== "active") {
    throw new AppError(httpStatus.FORBIDDEN, "User is not valid");
  }

  // chekc if password is correct
  if (isExistUser.password !== payload?.password) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is wrong");
  }

  // jwt payload

  if (isExistUser) {
    await User.findOneAndUpdate(
      { phone: payload?.phone }, // Query
      { $set: { isLogin: true, deviceInfo: deviceInfo } }, // Update
      { new: true } // Options
    );
  }

  const jwtPayload = {
    id: isExistUser._id,
    phone: isExistUser.phone,
    role: isExistUser?.role,
    name: isExistUser.name,
    access: isExistUser.access,
    photoUrl: isExistUser.photoUrl,
  };

  // create jwt access token

  const accessToken = jwt.sign(jwtPayload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "10d",
  });

  // create refresh token
  const refreshToken = jwt.sign(jwtPayload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "15d",
  });

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: isExistUser?.needsPasswordChange,
  };
};

// change password========================
const changePassword = async (user, password) => {
  const { oldPassword, newPassword } = password;

  const isUserExist = await User.findOne({ phone: user.phone }).select(
    "+password"
  );

  // check if user exist?

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  // check if the password match

  if ((await isUserExist.password) !== oldPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password Not Match");
  }

  // update

  await User.findOneAndUpdate(
    { phone: user.phone },
    {
      password: newPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );
};

//generate acces token usig refresh token===================

const refreshToken = async (token) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your are not authorized");
  }

  // if token is valid or not

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const { phone, iat } = decoded;

  const user = await User.findOne({ phone });

  // check user

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  const isActive = user.status;
  // check if the user is active or not

  if (!isActive === "active") {
    throw new AppError(httpStatus.FORBIDDEN, "User is not valid");
  }

  // check if the token generate before chage password?
  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  // create token

  const jwtPayload = {
    id: user._id,
    phone: user.phone,
    role: user?.role,
    name: user.name,
    access: user.access,
  };

  // create jwt access token

  const accessToken = jwt.sign(jwtPayload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "10d",
  });

  // return

  return {
    accessToken,
  };
};

// forgot password

const forgotPassword = async (phone) => {
  const isExistUser = await User.findOne({ phone: phone });

  // check if use exist or not
  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found !");
  }

  const isActive = isExistUser.status;
  // check if the user is active or not

  if (isActive !== "active") {
    throw new AppError(httpStatus.FORBIDDEN, "User is not authorized");
  }

  // generate random 4 digit code
  const generateRandomCode = () => {
    // Generate random 4-digit code
    return Math.floor(1000 + Math.random() * 9000);
  };

  const otp = generateRandomCode();
  const receiver = isExistUser.phone;

  // save code and user in reset model

  const expiration = new Date(Date.now() + 120000);

  const resetData = {
    phone: receiver,
    expiration: expiration,
    code: otp,
  };

  await ResetPassword.create(resetData);

  //send sms to the user phone

  const message = `You have requested to reset your password. Please use the following OTP to complete the process 
  OTP: ${otp} . SoE`;

  await SendSMS(receiver, message);
};

// reset password=================

const resetPassword = async (payload) => {
  const user = await User.findOne({ phone: payload.phone });
  // check user

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  const isActive = user.status;
  // check if the user is active or not

  if (!isActive === "active") {
    throw new AppError(httpStatus.FORBIDDEN, "User is not valid");
  }

  // check code to

  const resetPasswordEntry = await ResetPassword.findOne({
    phone: payload.phone,
    code: payload.code,
  }).exec();

  if (!resetPasswordEntry) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid code or user");
  }

  // Check if the current time is within the expiration window
  if (resetPasswordEntry.expiration < new Date()) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Code Is Expire");
  }

  const newPassword = payload.password;

  // change password
  await User.findOneAndUpdate(
    { phone: user.phone },
    {
      password: newPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );
};

// exports

module.exports = {
  authServices: {
    login,
    changePassword,
    refreshToken,
    forgotPassword,
    resetPassword,
  },
};
