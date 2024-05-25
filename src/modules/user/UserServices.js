const jwt = require("jsonwebtoken");

const User = require("./User.Model");

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

// exporst
module.exports = {
  userServices: {
    createUserIntoDB,
    getUserInfoFromDB,
  },
};
