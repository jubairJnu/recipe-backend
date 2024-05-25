const { userServices } = require("./UserServices");

const createUser = async (req, res) => {
  try {
    const payload = req.body;
    // console.log(payload, "in controller");

    const result = await userServices.createUserIntoDB(payload);
    res.status(200).json({
      success: true,
      message: "User is created successfully",
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

const getUserInfo = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(email, "in controller");

    const result = await userServices.getUserInfoFromDB(email);
    res.status(200).json({
      success: true,
      message: "User info retrived successfully",
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

// exports

module.exports = {
  userControllers: {
    createUser,
    getUserInfo,
  },
};
