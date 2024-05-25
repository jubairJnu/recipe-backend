const { recipesServices } = require("./RecipeServices");

const createRecipes = async (req, res) => {
  try {
    const payload = req.body;

    const result = await recipesServices.createRecipeIntoDB(payload);
    res.status(200).json({
      success: true,
      message: " created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(error?.statusCode ? error.statusCode : 500).json({
      success: false,
      // error: error,
      message: error?.message ? error.message : "something went wrong",
    });
  }
};

// get userIfo

const getAllRecipes = async (req, res) => {
  try {
    const result = await recipesServices.getAllRecipesFromDB();
    res.status(200).json({
      success: true,
      message: " retrived successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(error?.statusCode ? error.statusCode : 500).json({
      success: false,
      // error: error,
      message: error?.message ? error.message : "something went wrong",
    });
  }
};

// get sigle

const getSingleRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await recipesServices.getSingleRecipeFromDB(id);
    res.status(200).json({
      success: true,
      message: " retrived successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(error?.statusCode ? error.statusCode : 500).json({
      success: false,
      // error: error,
      message: error?.message ? error.message : "something went wrong",
    });
  }
};

// get same category

const getSameCategoryRecipy = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // console.log(category, "cate");

    const result = await recipesServices.getSameCategoryProductFromDB(category);
    res.status(200).json({
      success: true,
      message: "Retrieved successfully",
      data: result,
    });
  } catch (error) {
    // console.error(error); // Log the error for debugging purposes
    res.status(error?.statusCode ? error.statusCode : 500).json({
      success: false,
      message: error?.message ? error.message : "Something went wrong",
    });
  }
};

// exports

module.exports = {
  recipesControllers: {
    createRecipes,
    getAllRecipes,
    getSingleRecipe,
    getSameCategoryRecipy,
  },
};
