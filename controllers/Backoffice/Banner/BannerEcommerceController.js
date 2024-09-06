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

        res.status(200).json({
            message: "Get Data Success!",
            data: banners,
          });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
        });
    }
})

const getDataById = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;
        const banner = await M_Banner.findOne({
            where: {
                id: id,
                deletedAt: null
            }
        })

        res.status(200).json({
            message: "Get Data Success!",
            data: banner,
          });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
        });
    }
})

const updateDataById = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;
        const { image } = req.body;
        console.log(req.id)
        console.log(req.body)

        const banner = await M_Banner.update({
            image: image
        },{
            where: {
                id: id
            }
        })

        res.status(200).json({
            message: "Update Data Success!",
            data: banner,
          });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
        });
    }
})

module.exports = {
    getAllData,
    getDataById,
    updateDataById
}