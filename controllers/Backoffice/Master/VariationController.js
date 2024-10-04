const asyncHandler = require("express-async-handler");
const { M_Variations, M_Variant_Product_Detail } = require("../../../models/");

const getAllVariation = asyncHandler(async (req, res) => {
  try {
    const variants = await M_Variations.findAll();

    return res.status(200).json({
      message: "Get Data Success!",
      data: variants,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const createVariation = asyncHandler(async (req, res) => {
  try {
    const { variant } = req.body;

    const newData = await M_Variations.create({
      variasi: variant,
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

const getVariationById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await M_Variations.findOne({ where: { id: id } });

    if (!variant) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    return res.status(200).json({
      data: variant,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const updateVariation = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { variant } = req.body;

    const checkVariant = await M_Variations.findOne({ where: { id: id } });

    if (!checkVariant) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Variations.update(
      {
        variasi: variant,
      },
      {
        where: {
          id: id,
        },
      }
    );

    let newData = await M_Variations.findOne({ where: { id: id } });

    return res.status(200).json({
      message: `Update Data ${checkVariant.variasi} Success!`,
      data: newData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const deleteVariation = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const checkVariant = await M_Variations.findOne({ where: { id: id } });

    if (!checkVariant) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Variations.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: `Delete Data ${checkVariant.variasi} Success!`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const getVariationDetails = asyncHandler(async (req, res) => {
  try {
    const { variation_id, product_id } = req.params;
    console.log("params: " + variation_id);

    let variationDetails = await M_Variant_Product_Detail.findAll({
      where: {
        variation_id: variation_id,
        product_id: product_id,
      },
    });

    return res.status(200).json({
      message: "Get Data Success!",
      data: variationDetails,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  getAllVariation,
  createVariation,
  getVariationById,
  updateVariation,
  deleteVariation,
  getVariationDetails,
};
