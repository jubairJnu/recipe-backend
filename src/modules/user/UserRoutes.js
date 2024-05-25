const express = require("express");
const { userControllers } = require("./UserController");
const router = express.Router();

router.post("/sign-up", userControllers.createUser);
router.post("/purchase-recipe", userControllers.purchaseRecipe);
router.get("/:email", userControllers.getUserInfo);

// exports
module.exports = {
  userRoutes: router,
};

//https://api.first.org/data/v1/countries
