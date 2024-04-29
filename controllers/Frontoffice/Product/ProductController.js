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
  T_Stocks,
  T_Rate_And_Reviews,
  User_Ecommerces,
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
             attributes: [],
             where: {
               deletedAt: null,
             },
             required: false,
           },
         },
         {
           model: M_Photo_Products,
           as: "photos",
           where: {
             deletedAt: null,
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

const getProductById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await M_Products.findOne({
      where: {
        uuid: productId,
        deletedAt: null
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
            attributes: [],
            where: {
              deletedAt: null,
            },
            required: false,
          },
        },
        {
          model: M_Photo_Products,
          as: "photos",
          where: {
            deletedAt: null,
          },
          required: false,
        },
      ],
    });

    const productDetail = await M_Variant_Product_Detail.findAll({
      where: { product_id: product.id },
      include: [
        {
          model: T_Stocks,
          as: "t_stok_details",
          required: false,
          on: sequelize.literal(
            "`M_Variant_Product_Detail`.`product_id` = `t_stok_details`.`product_id` AND `M_Variant_Product_Detail`.`variation_id` = `t_stok_details`.`variation_id` AND `t_stok_details`.`deletedAt` IS NULL AND (`M_Variant_Product_Detail`.`warna` = `t_stok_details`.`warna` OR (`M_Variant_Product_Detail`.`warna` IS NULL AND `t_stok_details`.`warna` IS NULL)) AND (`M_Variant_Product_Detail`.`ukuran` = `t_stok_details`.`ukuran` OR (`M_Variant_Product_Detail`.`ukuran` IS NULL AND `t_stok_details`.`ukuran` IS NULL)) AND (`M_Variant_Product_Detail`.`lain_lain` = `t_stok_details`.`lain_lain` OR (`M_Variant_Product_Detail`.`lain_lain` IS NULL AND `t_stok_details`.`lain_lain` IS NULL))"
          ),
        },
      ],
    });

    const productSize = await M_Variant_Product_Detail.findAll({
      attributes: ["ukuran"],
      where: { product_id: product.id },
      include: [
        {
          model: T_Stocks,
          as: "t_stok_details",
          required: false,
          on: sequelize.literal(
            "`M_Variant_Product_Detail`.`product_id` = `t_stok_details`.`product_id` AND `M_Variant_Product_Detail`.`variation_id` = `t_stok_details`.`variation_id` AND `t_stok_details`.`deletedAt` IS NULL AND (`M_Variant_Product_Detail`.`warna` = `t_stok_details`.`warna` OR (`M_Variant_Product_Detail`.`warna` IS NULL AND `t_stok_details`.`warna` IS NULL)) AND (`M_Variant_Product_Detail`.`ukuran` = `t_stok_details`.`ukuran` OR (`M_Variant_Product_Detail`.`ukuran` IS NULL AND `t_stok_details`.`ukuran` IS NULL)) AND (`M_Variant_Product_Detail`.`lain_lain` = `t_stok_details`.`lain_lain` OR (`M_Variant_Product_Detail`.`lain_lain` IS NULL AND `t_stok_details`.`lain_lain` IS NULL))"
          ),
        },
      ],
      group: ["ukuran"],
    });

    const category = await M_Categories.findOne({
      where: {
        id: product.category_id,
        deletedAt: null,
      }
    });

    const productReviews = await T_Rate_And_Reviews.findAll({
      where: { 
        product_id: product.id,
        isShow: 1
      },
      include: [
        {
          model: User_Ecommerces,
          as: "User_Ecommerces",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(200).json({
      message: "Get Detail Product Success!",
      product: product,
      productDetail: productDetail,
      productSize: productSize,
      category: category,
      productReviews: productReviews,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  getProductByCategories,
  getProductByPopular,
  getProductByFeatured,
  getProductByLatest,
  getProductById,
};