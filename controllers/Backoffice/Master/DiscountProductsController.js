const asyncHandler = require("express-async-handler");
const { M_Discount_Products, M_Products } = require("../../../models");

const getAllDiscountProduct = asyncHandler(async (req, res) => {
  try {
    const discountProduct = await M_Discount_Products.findAll({
      include: [
        {
          model: M_Products,
          as: "M_Products",
          attributes: ['nama_barang'],
          where: {
            deletedAt: null,
          },
        }
      ],
    });

    return res.status(200).json({
      message: "Get Data Success!",
      data: discountProduct,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const createDiscountProduct = asyncHandler(async (req, res) => {
  try {
    const { product_id, diskon_persen, diskon_harga, start_date, end_date } =
      req.body;

    const newData = await M_Discount_Products.create({
      product_id: product_id,
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

const getDiscountProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const discountProduct = await M_Discount_Products.findOne({
      where: { id: id },
    });

    if (!discountProduct) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    return res.status(200).json({
      data: discountProduct,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const updateDiscountProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, diskon_persen, diskon_harga, start_date, end_date } =
      req.body;

    const checkDiscountProduct = await M_Discount_Products.findOne({
      where: { id: id },
    });

    if (!checkDiscountProduct) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Discount_Products.update(
      {
        product_id: product_id,
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

    let newData = await M_Discount_Products.findOne({ where: { id: id } });

    return res.status(200).json({
      message: `Update Data ${checkDiscountProduct.category} Success!`,
      data: newData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const deleteDiscountProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const checkDiscountProduct = await M_Discount_Products.findOne({
      where: { id: id },
    });

    if (!checkDiscountProduct) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Discount_Products.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: `Delete Data ${checkDiscountProduct.category} Success!`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  getAllDiscountProduct,
  createDiscountProduct,
  getDiscountProductById,
  updateDiscountProduct,
  deleteDiscountProduct,
};
