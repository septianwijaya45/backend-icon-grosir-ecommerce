const asyncHandler = require("express-async-handler");
const {
  sequelize,
  M_Products,
  M_Categories,
  M_Variations,
  M_Variation_Products,
  M_Variant_Product_Detail,
  M_Photo_Products,
  M_Sizes,
  M_Size_Products,
  T_Transaksi_Details,
} = require("../../../models/");

const getProductByCategories = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await M_Categories.findOne({
        where: {
            category: categoryId
        }
    });

     const products = await M_Products.findAll({
       where: {
         category_id: category.id,
       },
       include: [
         {
           model: M_Variations,
           through: {
             model: M_Variation_Products,
             as: "variation",
             attributes: [],
             where: {
               deletedAt: null,
             },
             required: false,
             through: {
               model: M_Variant_Product_Detail,
               as: "product_variation_detail",
               where: {
                 deletedAt: null,
               },
               required: false,
             },
           },
         },
         {
           model: M_Sizes,
           through: {
             model: M_Size_Products,
             as: "size",
             attributes: [], // Exclude additional attributes from the pivot table
             where: {
               deletedAt: null, // Tambahkan kondisi deletedAt harus null
             },
             required: false,
           },
         },
         {
           model: M_Photo_Products, // Include M_Photo_Products
           as: "photos", // Alias untuk mengakses hasil relasi
           where: {
             deletedAt: null, // Tambahkan kondisi deletedAt harus null
           },
           required: false,
         },
       ],
       limit: 8,
     });

    res.status(200).json({
      message: "Get 8 Product Success!",
      data: products,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});


const getProductByPopular= asyncHandler(async(req, res) => {
  try {
    const products = await M_Products.findAll({
      include: [
        {
          model: M_Variations,
          through: {
            model: M_Variation_Products,
            as: "variation",
            attributes: [],
            where: {
              deletedAt: null,
            },
            required: false,
            through: {
              model: M_Variant_Product_Detail,
              as: "product_variation_detail",
              where: {
                deletedAt: null,
              },
              required: false,
            },
          },
        },
        {
          model: M_Sizes,
          through: {
            model: M_Size_Products,
            as: "size",
            attributes: [], // Exclude additional attributes from the pivot table
            where: {
              deletedAt: null, // Tambahkan kondisi deletedAt harus null
            },
            required: false,
          },
        },
        {
          model: M_Photo_Products, // Include M_Photo_Products
          as: "photos", // Alias untuk mengakses hasil relasi
          where: {
            deletedAt: null, // Tambahkan kondisi deletedAt harus null
          },
          required: false,
        },
        {
          model: T_Transaksi_Details,
          as: "T_Transaksi_Details",
          attributes: [],
          group: ["product_id"],
          order: [[sequelize.literal("COUNT(*)"), "DESC"]],
          required: true,
        },
      ],
      limit: 4,
    });
    res.status(200).json({
      message: "Get Data Success!",
      data: products,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server Error! Please Contact Developer",
    });
  }
})

const getProductByFeatured = asyncHandler(async(req, res) => {
  let products = await M_Products.findAll({
    where: {
      deletedAt: null,
    },
    order: [["view_product", "DESC"]],
    limit: 4
  });
  res.status(200).json({
    message: "Get Data Success!",
    data: products,
  });
})

const getProductByLatest = asyncHandler(async (req, res) => {
  try {
    let products = await M_Products.findAll({
      where: {
        deletedAt: null,
      },
      order: [["createdAt", "DESC"]],
      limit: 4
    });
    res.status(200).json({
      message: "Get Data Success!",
      data: products,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server Error! Please Contact Developer",
    });
  }
})

module.exports = {
  getProductByCategories,
  getProductByPopular,
  getProductByFeatured,
  getProductByLatest,
};