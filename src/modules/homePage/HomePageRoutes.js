const express = require("express");
const { homePageController } = require("./HomePageController");

const router = express.Router();

router.get("/", homePageController.getAllHomeData);

// exports
module.exports = {
  homeRoutes: router,
};

//https://api.first.org/data/v1/countries
