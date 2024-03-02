const asyncHandler = require("express-async-handler");
const {
  M_Products,
  M_Variations,
  M_Variation_Products,
  M_Variant_Product_Detail,
  M_Photo_Products,
  M_Sizes,
  M_Size_Products,
  T_Stocks,
} = require("../../models/");
const { v4: uuidv4 } = require("uuid");
const { default: axios } = require("axios");

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    let products = await M_Products.findAll({
      where: {
        deletedAt: null,
      },
    });
    res.status(200).json({
      message: "Get Data Success!",
      data: products,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      nama_barang,
      artikel,
      category_id,
      deskripsi,
      harga,
      minimal_pembelian,
      satuan_berat,
      diskon_tipe,
      status_barang,
      varian,
      size,
      stock,
      foto_1,
      foto_2,
      foto_3,
      foto_4,
      foto_5,
    } = req.body;

    const dataProduct = {
      uuid: uuidv4(),
      category_id: category_id,
      nama_barang: nama_barang,
      artikel: artikel,
      deskripsi: deskripsi,
      harga: harga,
      minimum_pemesanan: minimal_pembelian,
      satuan_berat: satuan_berat,
      diskon_tipe: null,
      status_barang: status_barang,
    };

    const product = await M_Products.create(dataProduct);

    const stockCreate = await T_Stocks.create({
      product_id: product.id,
      stock: stock,
    });

    if (varian.length != 0) {
      for (let i = 0; i < varian.length; i++) {
        M_Variation_Products.create({
          variation_id: varian[i],
          product_id: product.id,
        });

        if (req.body[`varian${i}_detail1`]) {
          M_Variant_Product_Detail.create({
            variation_id: varian[i],
            product_id: product.id,
            variasi_detail: req.body[`varian${i}_detail1`],
          });
        }
        if (req.body[`varian${i}_detail2`]) {
          M_Variant_Product_Detail.create({
            variation_id: varian[i],
            product_id: product.id,
            variasi_detail: req.body[`varian${i}_detail2`],
          });
        }
        if (req.body[`varian${i}_detail3`]) {
          M_Variant_Product_Detail.create({
            variation_id: varian[i],
            product_id: product.id,
            variasi_detail: req.body[`varian${i}_detail3`],
          });
        }
        if (req.body[`varian${i}_detail4`]) {
          M_Variant_Product_Detail.create({
            variation_id: varian[i],
            product_id: product.id,
            variasi_detail: req.body[`varian${i}_detail4`],
          });
        }
        if (req.body[`varian${i}_detail5`]) {
          M_Variant_Product_Detail.create({
            variation_id: varian[i],
            product_id: product.id,
            variasi_detail: req.body[`varian${i}_detail5`],
          });
        }
      }
    }

    if (size.length != 0) {
      for (let i = 0; i < size.length; i++) {
        M_Size_Products.create({
          size_id: size[i],
          product_id: product.id,
        });
      }
    }

    if (foto_1 && foto_1 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_1,
      });
    }
    if (foto_2 && foto_2 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_2,
      });
    }
    if (foto_3 && foto_3 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_3,
      });
    }
    if (foto_4 && foto_4 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_4,
      });
    }
    if (foto_5 && foto_5 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_5,
      });
    }

    res.status(200).json({
      message: "Get Data Success!",
      data: product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await M_Products.findOne({
      where: {
        uuid: id,
        deletedAt: null,
      },
      include: [
        {
          model: M_Variations,
          through: {
            model: M_Variation_Products,
            as: "variation",
            attributes: [], // Exclude additional attributes from the pivot table
            where: {
              deletedAt: null, // Tambahkan kondisi deletedAt harus null
            },
            required: false,
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
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const stock = await T_Stocks.findOne({
      where: {
        product_id: product.id,
      },
    });


    res.status(200).json({
      message: "Get Data Success!",
      data: product,
      stock: stock,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { uuid } = req.params;
    const {
      nama_barang,
      artikel,
      category_id,
      deskripsi,
      harga,
      minimal_pembelian,
      satuan_berat,
      diskon_tipe,
      status_barang,
      varian,
      size,
      stock,
      foto_1,
      foto_2,
      foto_3,
      foto_4,
      foto_5,
    } = req.body;

    const dataProduct = {
      category_id: category_id,
      nama_barang: nama_barang,
      artikel: artikel,
      deskripsi: deskripsi,
      harga: harga,
      minimum_pemesanan: minimal_pembelian,
      satuan_berat: satuan_berat,
      diskon_tipe: null,
      status_barang: status_barang,
    };

    const product = await M_Products.findOne({ where: { uuid: uuid } });

    const updateProduct = await M_Products.update(dataProduct, {
      where: {
        uuid: uuid,
      },
    });

    const stockCreate = await T_Stocks.update(
      {
        stock: stock,
      },
      {
        where: {
          product_id: product.id,
        },
      }
    );

    const deleteVariationProduct = await M_Variation_Products.destroy({
      where: {
        product_id: product.id,
      },
    });

    const deleteVarianDetail = await M_Variant_Product_Detail.destroy({
      where: {
        product_id: product.id,
      },
    });

    const deleteSize = await M_Size_Products.destroy({
      where: {
        product_id: product.id,
      },
    });

    if (varian != null) {
      for (let i = 0; i < varian.length; i++) {
        M_Variation_Products.create({
          variation_id: varian[i],
          product_id: product.id,
        });

        if (req.body[`varian${i}_detail1`]) {
          M_Variant_Product_Detail.create({
            variation_id: varian[i],
            product_id: product.id,
            variasi_detail: req.body[`varian${i}_detail1`],
          });
        }
        if (req.body[`varian${i}_detail2`]) {
          M_Variant_Product_Detail.create({
            variation_id: varian[i],
            product_id: product.id,
            variasi_detail: req.body[`varian${i}_detail2`],
          });
        }
        if (req.body[`varian${i}_detail3`]) {
          M_Variant_Product_Detail.create({
            variation_id: varian[i],
            product_id: product.id,
            variasi_detail: req.body[`varian${i}_detail3`],
          });
        }
        if (req.body[`varian${i}_detail4`]) {
          M_Variant_Product_Detail.create({
            variation_id: varian[i],
            product_id: product.id,
            variasi_detail: req.body[`varian${i}_detail4`],
          });
        }
        if (req.body[`varian${i}_detail5`]) {
          M_Variant_Product_Detail.create({
            variation_id: varian[i],
            product_id: product.id,
            variasi_detail: req.body[`varian${i}_detail5`],
          });
        }
      }
    }

    if (size != null) {
      for (let i = 0; i < size.length; i++) {
        M_Size_Products.create({
          size_id: size[i],
          product_id: product.id,
        });
      }
    }

    if (foto_1 && foto_1 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_1,
      });
    }
    if (foto_2 && foto_2 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_2,
      });
    }
    if (foto_3 && foto_3 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_3,
      });
    }
    if (foto_4 && foto_4 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_4,
      });
    }
    if (foto_5 && foto_5 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_5,
      });
    }

    res.status(200).json({
      message: "Update Data Success!",
      data: product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { uuid } = req.params;

    const product = await M_Products.findOne({ where: { uuid: uuid } });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const deleteProduct = await M_Products.destroy({
      where: {
        uuid: uuid,
      },
    });

    res.status(200).json({
      message: "Delete Data Success!",
      status: true,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const syncProduct = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(
      "https://backoffice.icongrosir.com/api/get-stok"
    );

    const syncDataProduct = response.data.data;

    syncDataProduct.forEach(async (product) => {
      const getProduct = await M_Products.findOne({
        where: { artikel: product.artikel },
      });

      if (!getProduct) {
        const createProduct = await M_Products.create({
          uuid: uuidv4(),
          category_id: 4,
          nama_barang: product.nama_barang,
          artikel: product.artikel,
          harga: product.harga,
        });

        const stockCreate = await T_Stocks.create({
          product_id: createProduct.id,
          stock: product.total_stok,
        });
      }
    });

    res.status(200).json({
      message: "Sync Data Success!",
      status: true,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  syncProduct,
};
