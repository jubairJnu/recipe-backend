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

const getAllRecipesFromDB = async (name, category, country, page) => {
  // console.log(page, "page");
  let query = {};

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  if (country) {
    query.country = { $regex: country, $options: "i" };
  }

  if (category) {
    query.category = { $regex: `^${category}$`, $options: "i" };
  }
  let limit = 1;
  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  // Find recipes based on the constructed query, and apply pagination
  const result = await Recipe.find(query).skip(skip).limit(limit);

  // Get the total count of documents matching the query
  const totalCount = await Recipe.countDocuments(query);
  // console.log(result, "in service");
  return {
    data: result,
    totalCount: totalCount,
  };
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
