const asyncHandler = require("express-async-handler");
const { Op } = require('sequelize')
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
  T_Wishlist_Details
} = require("../../../models/");

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

    const categoryId = req.query.category;
    const sortBy = req.query.sort_by;
    const search = req.query.search;

    const queryOptions = {
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
      limit: limit,
      offset: offset,
      where: {},
    };

    // Filter by category if provided
    if (categoryId) {
      queryOptions.where.category_id = categoryId;
    }

    // Filter by search term if provided
    if (search) {
      queryOptions.where.nama_barang = {
        [Op.like]: `%${search}%`,
      };
    }

    // Apply sorting if provided
    if (sortBy) {
      if (sortBy === 'nama_asc') {
        queryOptions.order = [['nama_barang', 'ASC']];
      } else if (sortBy === 'nama_desc') {
        queryOptions.order = [['nama_barang', 'DESC']];
      } else if (sortBy === 'harga_asc') {
        queryOptions.order = [['harga', 'ASC']];
      } else if (sortBy === 'harga_desc') {
        queryOptions.order = [['harga', 'DESC']];
      } else if (sortBy === 'tanggal_asc') {
        queryOptions.order = [['createdAt', 'ASC']];
      } else if (sortBy === 'tanggal_desc') {
        queryOptions.order = [['createdAt', 'DESC']];
      }
    }

    const products = await M_Products.findAndCountAll(queryOptions);
    
    const totalPages = Math.ceil(products.rows.length / limit);
    
    res.status(200).json({
      message: "Get Products Success!",
      data: products.rows,
      pagination: {
        totalItems: products.count,
        totalPages: totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});


const getTopViewProduct = asyncHandler(async (req, res) => {
  try {
    const topViewedProducts = await M_Products.findAll({
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
      order: [['view_product', 'DESC']],
      limit: 3,
    });    

    res.status(200).json({
      message: "Get Top View Success!",
      data: topViewedProducts,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
})

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


    if(product){
      await M_Products.update({
        view_product: (product.view_product != null ? product.view_product : 0) + 1
      }, {
        where: {
          uuid: productId,
          deletedAt: null
        }
      })
    }

    const productVarian = await M_Variant_Product_Detail.findAll({
      attributes: ["variasi_detail"],
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
      group: ["variasi_detail"],
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
      category: category,
      productReviews: productReviews,
      variants:productVarian
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const getVarianById = asyncHandler(async (req, res) => {
  try {
    const { product_id } = req.params;

    const productDetail = await M_Products.findOne({
      where: {
        uuid: product_id
      }
    })

    const variantBarangDetails = await M_Variant_Product_Detail.findAll({
      where: {product_id: productDetail.id},
      attributes: ['variasi_detail'],
      group: ['variasi_detail']
    })

    res.status(200).json(variantBarangDetails);
    
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
});

const getWarnaById = asyncHandler(async(req, res) => {
  try {
    const { product_id, variant_id, wishlish } = req.params;
    const productDetail = await M_Products.findOne({
      where: {
        uuid: product_id
      }
    })

    const update = await T_Wishlist_Details.update({
      varian: variant_id,
    }, {
      where: {
        id: wishlish,
        product_id: productDetail.id
      }
    })
    

    const variantBarangDetails = await M_Variant_Product_Detail.findAll({
      where: {
        product_id: productDetail.id,
        variasi_detail: variant_id
      },
      attributes: ['warna']
    })

    res.status(200).json(variantBarangDetails);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
})

const getUkuranById = asyncHandler(async(req, res) => {
  try {
    const { product_id, variant_id, warna, wishlish } = req.params;
    const productDetail = await M_Products.findOne({
      where: {
        uuid: product_id
      }
    })

    await T_Wishlist_Details.update({
      warna: warna
    }, {
      where: {
        id: wishlish,
        product_id: productDetail.id,
        varian: variant_id
      }
    })

    const variantBarangDetails = await M_Variant_Product_Detail.findAll({
      where: {
        product_id: productDetail.id,
        variasi_detail: variant_id,
        warna: warna
      },
      attributes: ['ukuran']
    })

    res.status(200).json(variantBarangDetails);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
})

const getHargaById = asyncHandler(async(req, res) => {
  try {
    const { product_id, variant_id,  warna, ukuran, wishlish} = req.params;
    const productDetail = await M_Products.findOne({
      where: {
        uuid: product_id
      }
    })

    await T_Wishlist_Details.update({
      ukuran: ukuran,
    }, {
      where: {
        id: wishlish,
        product_id: productDetail.id,
        varian: variant_id,
        warna: warna
      }
    })

    const variantBarangDetails = await M_Variant_Product_Detail.findOne({
      where: {
        product_id: productDetail.id,
        variasi_detail: variant_id,
        warna: warna,
        ukuran: ukuran
      },
      attributes: ['harga']
    })

    await T_Wishlist_Details.update({
      price: variantBarangDetails.harga
    }, {
      where: {
        id: wishlish,
        product_id: productDetail.id,
        varian: variant_id,
        warna: warna,
        ukuran: ukuran
      }
    })
    
    res.status(200).json(variantBarangDetails);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
})

const getWarnaProduct = asyncHandler(async(req, res) => {
  try {
    const { product_id, variant_id } = req.params;
    const productDetail = await M_Products.findOne({
      where: {
        uuid: product_id
      }
    })

    const variantBarangDetails = await M_Variant_Product_Detail.findAll({
      where: {
        product_id: productDetail.id,
        variasi_detail: variant_id
      },
      attributes: ['warna']
    })
    console.log('variantBarangDetails')
    console.log(productDetail.id)
    console.log(variant_id);
    
    console.log(variantBarangDetails)

    res.status(200).json(variantBarangDetails);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
})
  
const getUkuranProduct = asyncHandler(async(req, res) => {
  try {
    const { product_id, variant_id, warna } = req.params;
    const productDetail = await M_Products.findOne({
      where: {
        uuid: product_id
      }
    })

    const variantBarangDetails = await M_Variant_Product_Detail.findAll({
      where: {
        product_id: productDetail.id,
        variasi_detail: variant_id,
        warna: warna
      },
      attributes: ['ukuran']
    })
    

    res.status(200).json(variantBarangDetails);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
})

const getHargaProduct = asyncHandler(async(req, res) => {
  try {
    const { product_id, variant_id,  warna, ukuran, cart} = req.params;
    const productDetail = await M_Products.findOne({
      where: {
        uuid: product_id
      }
    })

    const variantBarangDetails = await M_Variant_Product_Detail.findOne({
      where: {
        product_id: productDetail.id,
        variasi_detail: variant_id,
        warna: warna,
        ukuran: ukuran
      },
      attributes: ['harga']
    })
    
    res.status(200).json(variantBarangDetails);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
})

module.exports = {
  getProductByCategories,
  getProductByPopular,
  getProductByFeatured,
  getProductByLatest,
  getProductById,
  getAllProduct,
  getVarianById,
  getWarnaById,
  getUkuranById,
  getHargaById,
  getTopViewProduct,
  getWarnaProduct,
  getUkuranProduct,
  getHargaProduct
};