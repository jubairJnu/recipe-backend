const express = require("express");
const { authControllers } = require("./AuthController");
const auth = require("../../middleware/Aulth.Middleware");
const DetectDevice = require("../../middleware/DetectUserDevice");

const router = express.Router();

router.post("/login", DetectDevice, authControllers.loginUser);
router.patch("/change-password", auth, authControllers.changeUserPassword);

router.post("/refresh-token", authControllers.refreshToken);
router.post("/forgot-password", authControllers.forgotPassword);
router.post("/reset-password", authControllers.resetPassword);

module.exports = {
  authRoutes: router,
};
