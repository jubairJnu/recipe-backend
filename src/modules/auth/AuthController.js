/* eslint-disable no-undef */
const { authServices } = require("./Auth.Service");

const loginUser = async (req, res) => {
  // console.log("resq", req.deviceInfo);
  try {
    const result = await authServices.login(req.body, req.deviceInfo);
    // destructure result to send frontend

    const { refreshToken, accessToken, needsPasswordChange } = result;
    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "User Login Successfully",
      data: { accessToken, needsPasswordChange },
    });
  } catch (error) {
    res.status(error?.statusCode).json({
      success: false,
      // error: error,
      message: error.message,
    });
  }
};

// change pasword

const changeUserPassword = async (req, res) => {
  try {
    const user = req.user;
    const password = req.body;
    const result = await authServices.changePassword(user, password);

    res.status(200).json({
      success: true,
      message: "Password is Updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error,
      success: false,
      message: error?.message,
    });
  }
};

// refreshToken

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    const result = await authServices.refreshToken(refreshToken);
    res.status(200).json({
      success: true,
      message: "Access token is retrived successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

// forgot pasword

const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    const result = await authServices.forgotPassword(phone);
    res.status(200).json({
      success: true,
      message: "OTP Sent  successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authServices.resetPassword(req.body);
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: result,
    });
  } catch (error) {
    res.status(error?.statusCode).json({
      success: false,
      message: error?.message,
    });
  }
};

// exports

module.exports = {
  authControllers: {
    loginUser,
    changeUserPassword,
    refreshToken,
    forgotPassword,
    resetPassword,
  },
};
