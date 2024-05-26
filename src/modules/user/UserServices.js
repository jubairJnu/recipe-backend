const jwt = require("jsonwebtoken");

const User = require("./User.Model");
const Recipe = require("../recipe/Recipe.Model");
const { default: mongoose } = require("mongoose");

const createUserIntoDB = async (payload) => {
  // console.log(payload, "in service");
  const existUser = await User.findOne({ email: payload.email });

  if (existUser) {
    const jwtPayload = {
      email: existUser.email,
      displayName: existUser.phone,
    };
    const token = jwt.sign(jwtPayload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "10d",
    });
    return { token };
  }

  // create jwt

  // create jwt access token
  const jwtPayload = {
    email: payload.email,
    displayName: payload.displayName,
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "10d",
  });

  const result = await User.create(payload);
  return { token, result };
};

// get user info

const getUserInfoFromDB = async (email) => {
  const result = await User.findOne({ email: email });
  return result;
};

// purchase recipe

const purchaseRecipeFromDB = async (payload) => {
  // console.log(payload, "in service purchase");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const checkUser = await User.findOne({ email: payload.user }).session(
      session
    );
    if (!checkUser) {
      throw new Error("User not found");
    }

    // Decrease user's coin balance by 10
    await User.findOneAndUpdate(
      { email: payload.user },
      { $inc: { coin: -10 } },
      { session }
    );

    // Increase creator's coin balance by 1
    await User.findOneAndUpdate(
      { email: payload.creatorEmail },
      { $inc: { coin: 1 } },
      { session }
    );

    // Increment watchCount for the recipe
    await Recipe.findOneAndUpdate(
      { _id: payload.id },
      {
        $addToSet: { purchased_by: payload.user },
        $inc: { watchCount: 1 },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    console.log("Transaction committed successfully");
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction aborted due to error:", error);
  }
};

// purchase coin

const purchaseCoinFromDB = async (payload, email) => {
  const result = await User.findOneAndUpdate(
    { email: email },
    { $inc: { coin: payload } }
  );
  return result;
};

// exporst
module.exports = {
  userServices: {
    createUserIntoDB,
    getUserInfoFromDB,
    purchaseRecipeFromDB,
    purchaseCoinFromDB,
  },
};
