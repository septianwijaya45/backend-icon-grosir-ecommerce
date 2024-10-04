const asyncHandler = require("express-async-handler");
const {
  sequelize,
  M_Banner,
} = require("../../../models/");

const getAllData = asyncHandler(async(req, res) => {
    try {
        const banners = await M_Banner.findAll({
            where: {deletedAt: null}
        })

        return res.status(200).json({
            message: "Get Data Success!",
            data: banners,
          });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
        });
    }
})

module.exports = {
    getAllData
}