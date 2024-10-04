const asyncHandler = require("express-async-handler");
const {
  T_Rate_And_Reviews,
  M_Products,
  User_Ecommerces,
} = require("../../../models/");

const getAllRateReviews = asyncHandler(async (req, res) => {
  try {
    const getDataRateReviews = await T_Rate_And_Reviews.findAll({
      include: [
        {
          model: M_Products,
          as: "M_Products",
          required: true,
        },
        {
          model: User_Ecommerces,
          as: "User_Ecommerces",
          required: true,
        },
      ],
    });

    return res.status(201).json({
      message: "Get Data Success!",
      data: getDataRateReviews,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const createRateReviews = asyncHandler(async (req, res) => {
  try {
    const {
      user_id,
      product_id,
      foto_preview,
      rating,
      review_deskripsi,
      isShow,
    } = req.body;

    const dataReview = {
      user_ecommerce_id: user_id,
      product_id: product_id,
      foto_preview: foto_preview,
      rating: rating,
      review_deskripsi: review_deskripsi,
      isShow: isShow,
    };

    const rateViewInsert = await T_Rate_And_Reviews.create(dataReview);

    return res.status(201).json({
      message: "Success When Insert Data!",
      data: rateViewInsert,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const getRateReviewById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const getDataRateReviews = await T_Rate_And_Reviews.findOne(
      {
        where: {
          id: id,
        },
      },
      {
        include: [
          {
            model: M_Products,
            as: "M_Products",
            required: true,
          },
          {
            model: User_Ecommerces,
            as: "User_Ecommerces",
            required: true,
          },
        ],
      }
    );

    if (!getDataRateReviews) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    return res.status(200).json({
      data: getDataRateReviews,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const updateRateReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      product_id,
      foto_preview,
      rating,
      review_deskripsi,
      isShow,
    } = req.body;

    const dataReview = {
      user_ecommerce_id: user_id,
      product_id: product_id,
      foto_preview: foto_preview,
      rating: rating,
      review_deskripsi: review_deskripsi,
      isShow: isShow,
    };

    const checkRateReview = await T_Rate_And_Reviews.findOne({
      where: { id: id },
    });

    if (!checkRateReview) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await T_Rate_And_Reviews.update(dataReview, {
      where: {
        id: id,
      },
    });

    await res.status(200).json({
      message: `Update Data Success!`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const deleteRateReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const checkRateReview = await T_Rate_And_Reviews.findOne({
      where: { id: id },
    });

    if (!checkRateReview) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await T_Rate_And_Reviews.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: `Delete Data Success!`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  getAllRateReviews,
  createRateReviews,
  getRateReviewById,
  updateRateReview,
  deleteRateReview,
};
