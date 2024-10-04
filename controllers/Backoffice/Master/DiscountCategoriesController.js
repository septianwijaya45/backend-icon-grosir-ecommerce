const asyncHandler = require("express-async-handler");
const { M_Discount_Categories, M_Categories } = require("../../../models/");

const getAllDiscountCategory = asyncHandler(async (req, res) => {
  try {
    const discountCategory = await M_Discount_Categories.findAll({
      include: [
        {
          model: M_Categories,
          as: "M_Categories",
          attributes: ['category'],
          where: {
            deletedAt: null,
          },
        }
      ],
    });

    return res.status(200).json({
      message: "Get Data Success!",
      data: discountCategory,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const createDiscountCategory = asyncHandler(async (req, res) => {
  try {
    const { category_id, diskon_persen, diskon_harga, start_date, end_date } =
      req.body;

    const newData = await M_Discount_Categories.create({
      category_id: category_id,
      diskon_persen: diskon_persen,
      diskon_harga: diskon_harga,
      start_date: start_date,
      end_Date: end_date,
    });

    return res.status(200).json({
      message: "Create Data Success!",
      data: newData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const getDiscountCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const discountCategory = await M_Discount_Categories.findOne({
      where: { id: id },
    });

    if (!discountCategory) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    return res.status(200).json({
      data: discountCategory,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const updateDiscountCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, diskon_persen, diskon_harga, start_date, end_date } =
      req.body;

    const checkDiscountCategory = await M_Discount_Categories.findOne({
      where: { id: id },
    });

    if (!checkDiscountCategory) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Discount_Categories.update(
      {
        category_id: category_id,
        diskon_persen: diskon_persen,
        diskon_harga: diskon_harga,
        start_date: start_date,
        end_Date: end_date,
      },
      {
        where: {
          id: id,
        },
      }
    );

    let newData = await M_Discount_Categories.findOne({ where: { id: id } });

    return res.status(200).json({
      message: `Update Data ${checkDiscountCategory.category} Success!`,
      data: newData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const deleteDiscountCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const checkDiscountCategory = await M_Discount_Categories.findOne({
      where: { id: id },
    });

    if (!checkDiscountCategory) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Discount_Categories.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: `Delete Data ${checkDiscountCategory.category} Success!`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  getAllDiscountCategory,
  createDiscountCategory,
  getDiscountCategoryById,
  updateDiscountCategory,
  deleteDiscountCategory,
};
