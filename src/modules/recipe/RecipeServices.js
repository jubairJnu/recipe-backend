const User = require("../user/User.Model");
const Recipe = require("./Recipe.Model");

const createRecipeIntoDB = async (payload) => {
  // const email = payload.creatorEmail;

  const result = await Recipe.create(payload);

  // if (result.length > 0) {
  //   const incrementCoint = await User.findOneAndUpdate(
  //     { email: email },
  //     { $inc: { coin: 1 } }
  //   );
  // }

  return result;
};

// get all

const getAllRecipesFromDB = async (email) => {
  const result = await Recipe.find();
  return result;
};

// get single

const getSingleRecipeFromDB = async (id) => {
  const result = await Recipe.findById(id);
  return result;
};

// get category

const getSameCategoryProductFromDB = async (category) => {
  const query = {
    category: new RegExp(category, "i"),
  };

  const result = await Recipe.find(query).limit(3);
  return result;
};

//

// exporst
module.exports = {
  recipesServices: {
    createRecipeIntoDB,
    getAllRecipesFromDB,
    getSingleRecipeFromDB,
    getSameCategoryProductFromDB,
  },
};
