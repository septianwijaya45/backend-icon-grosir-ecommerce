const asyncHandler = require("express-async-handler");
const {
  M_Categories,
  M_Products,
  sequelize,
  Sequelize,
} = require("../../../models");

const getFiveCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await M_Categories.findAll({
      where: {
        category: {
          [Sequelize.Op.not]: "Sync Product",
        },
      },
      limit: 5,
    });

    res.status(200).json({
      message: "Get 5 Categories Success!",
      data: categories,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const getTreeCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await M_Categories.findAll({
      attributes: [
        "id",
        "category",
        [
          Sequelize.fn("COUNT", Sequelize.col("M_Products.id")),
          "product_count",
        ],
      ],
      include: [
        {
          model: M_Products,
          as: "M_Products",
          attributes: [],
        },
      ],
      where: {
        category: {
          [Sequelize.Op.not]: "Sync Product",
        },
      },
      group: ["M_Categories.id"],
      order: [[Sequelize.literal("product_count"), "DESC"]],
      limit: 3,
    });

    res.status(200).json({
      message: "Get 3 Categories Success!",
      data: categories,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  getFiveCategory,
  getTreeCategory,
};
