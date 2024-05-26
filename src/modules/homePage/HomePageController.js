const { homePageService } = require("./HomePageService");

const getAllHomeData = async (req, res) => {
  try {
    const result = await homePageService.getAllDataForHome();
    res.status(200).json({
      success: true,
      message: "retrived successfully",
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

module.exports = {
  homePageController: {
    getAllHomeData,
  },
};
