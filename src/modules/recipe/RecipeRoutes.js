const express = require("express");
const { recipesControllers } = require("./RecipeController");
const auth = require("../../middleware/AuthMiddleWare");

const router = express.Router();

router.post("/", recipesControllers.createRecipes);
router.get("/", recipesControllers.getAllRecipes);
router.get("/:id", auth, recipesControllers.getSingleRecipe);
router.get("/same/:category", recipesControllers.getSameCategoryRecipy);

// exports
module.exports = {
  recipesRoutes: router,
};

//https://api.first.org/data/v1/countries
