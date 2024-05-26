const Recipe = require("../recipe/Recipe.Model");
const User = require("../user/User.Model");

const getAllDataForHome = async () => {
  const userData = await User.countDocuments();
  const recipesData = await Recipe.countDocuments();
  // console.log(userData, "user");

  const totalUser = userData ? userData : 0;
  // console.log(totalUser);
  const totalRecipes = recipesData ? recipesData : 0;

  return {
    totalRecipes,
    totalUser,
  };
};

module.exports = {
  homePageService: { getAllDataForHome },
};
