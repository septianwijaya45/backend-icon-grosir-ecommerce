const asyncHandler = require("express-async-handler");
const { Op } = require('sequelize')
const {
  sequelize,
  M_Products,
  M_Variations,
  M_Variation_Products,
  M_Variant_Product_Detail,
  M_Photo_Products,
  M_Sizes,
  M_Size_Products,
  T_Stocks,
} = require("../../../models/");
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
      minimal_pembelian,
      status_barang,
      varian,
      warna,
      ukuran,
      lain_lain,
      harga,
      stok,
      foto_1,
      foto_2,
      foto_3,
      foto_4,
      foto_5,
      foto_6,
      foto_7,
      foto_8,
      foto_9,
      foto_10,
      video,
    } = req.body;

    const dataProduct = {
      uuid: uuidv4(),
      category_id: category_id,
      nama_barang: nama_barang,
      artikel: artikel,
      deskripsi: deskripsi,
      minimum_pemesanan: minimal_pembelian,
      diskon_tipe: null,
      status_barang: status_barang,
    };

    const product = await M_Products.create(dataProduct);

    if (varian.length != 0) {
      for (let i = 0; i < varian.length; i++) {
        let getVarian
        if(varian[i] == 'standard'){
          getVarian = await M_Variations.findOne({
            where: {
              variasi: {
                [Op.like]: "%standard%",
              },
            },
          });
        }else{
          getVarian = await M_Variations.findOne({
            where: { id: varian[i] },
          });
        }

        await M_Variation_Products.create({
          variation_id: getVarian.id,
          product_id: product.id,
        });

        await M_Variant_Product_Detail.create({
          variation_id: getVarian.id,
          product_id: product.id,
          variasi_detail: getVarian.variasi,
          warna: warna[i],
          ukuran: ukuran[i],
          lain_lain: lain_lain[i],
          harga: harga[i],
        });

        await T_Stocks.create({
          variation_id: getVarian.id,
          product_id: product.id,
          warna: warna[i],
          ukuran: ukuran[i],
          lain_lain: lain_lain[i],
          stock: stok[i],
        });
      }
    }

    if (ukuran.length != 0) {
      for (let i = 0; i < ukuran.length; i++) {
        let idSize = await M_Sizes.findOne({
          where: { size: ukuran[i] },
        });

        await M_Size_Products.create({
          size_id: idSize.id,
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
    if (foto_6 && foto_6 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_6,
      });
    }
    if (foto_7 && foto_7 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_7,
      });
    }
    if (foto_8 && foto_8 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_8,
      });
    }
    if (foto_9 && foto_9 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_9,
      });
    }
    if (foto_10 && foto_10 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_10,
      });
    }
    if (video && video != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: video,
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
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const variations = await M_Variant_Product_Detail.findAll({
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


    const stock = await T_Stocks.findOne({
      where: {
        product_id: product.id,
      },
    });

    res.status(200).json({
      message: "Get Data Success!",
      data: product,
      stock: stock,
      variations: variations,
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
      minimal_pembelian,
      status_barang,
      varian,
      variant_id,
      warna,
      ukuran,
      lain_lain,
      warnaBefore,
      ukuranBefore,
      lain_lainBefore,
      harga,
      stok,
      foto_1,
      foto_2,
      foto_3,
      foto_4,
      foto_5,
      foto_6,
      foto_7,
      foto_8,
      foto_9,
      foto_10,
      video,
    } = req.body;

    const dataProduct = {
      category_id: category_id,
      nama_barang: nama_barang,
      artikel: artikel,
      deskripsi: deskripsi,
      minimum_pemesanan: minimal_pembelian,
      diskon_tipe: null,
      status_barang: status_barang,
    };

    const product = await M_Products.findOne({ where: { uuid: uuid } });

    const updateProduct = await M_Products.update(dataProduct, {
      where: {
        uuid: uuid,
      },
    });

    if (varian.length != 0) {
      for (let i = 0; i < varian.length; i++) {
        let getVarian;
        if (varian[i] == "standard") {
          getVarian = await M_Variations.findOne({
            where: {
              variasi: {
                [Op.like]: "%standard%",
              },
            },
          });
        } else {
          getVarian = await M_Variations.findOne({
            where: { id: varian[i] },
          });
        }

        if (
          variant_id[i] !== null &&
          typeof variant_id[i] !== "undefined"
        ) {
          // variant product
          await M_Variation_Products.findOne({
            where: {
              variation_id: variant_id[i],
              product_id: product.id,
            },
          }).then((variantProduct) => {
            return variantProduct.update({
              variation_id: varian[i],
            });
          });

          // variant product detail
          await M_Variant_Product_Detail.findOne({
            where: {
              variation_id: variant_id[i],
              product_id: product.id,
              warna: warnaBefore[i],
              ukuran: ukuranBefore[i],
              lain_lain: lain_lainBefore[i],
            },
          }).then((variantProductDetail) => {
            return variantProductDetail.update({
              variation_id: getVarian.id,
              product_id: product.id,
              variasi_detail: getVarian.variasi,
              warna: warna[i],
              ukuran: ukuran[i],
              lain_lain: lain_lain[i],
              harga: harga[i],
            });
          });

          // Stok
          await T_Stocks.findOne({
            where: {
              variation_id: variant_id[i],
              product_id: product.id,
              warna: warnaBefore[i],
              ukuran: ukuranBefore[i],
              lain_lain: lain_lainBefore[i],
            },
          }).then((stok) => {
            return stok.update({
              variation_id: getVarian.id,
              product_id: product.id,
              warna: warna[i],
              ukuran: ukuran[i],
              lain_lain: lain_lain[i],
              stock: stok[i],
            });
          });
        } else {
          console.log('masuk sana')
          await M_Variation_Products.create({
            variation_id: getVarian.id,
            product_id: product.id,
          });

          await M_Variant_Product_Detail.create({
            variation_id: getVarian.id,
            product_id: product.id,
            variasi_detail: getVarian.variasi,
            warna: warna[i],
            ukuran: ukuran[i],
            lain_lain: lain_lain[i],
            harga: harga[i],
          });

          await T_Stocks.create({
            variation_id: getVarian.id,
            product_id: product.id,
            warna: warna[i],
            ukuran: ukuran[i],
            lain_lain: lain_lain[i],
            stock: stok[i],
          });
        }
      }
    }

    if (ukuran.length != 0) {
      for (let i = 0; i < ukuran.length; i++) {
        let idSize = await M_Sizes.findOne({
          where: { size: ukuran[i] },
        });
        let idSizeBefore = await M_Sizes.findOne({
          where: { size: ukuranBefore[i] },
        });

        let checkSize = M_Size_Products.findOne({
          size_id: idSize.id,
          product_id: product.id,
        });

        if (!checkSize) {
          await M_Size_Products.create({
            size_id: idSize.id,
            product_id: product.id,
          });
        } else {
          await M_Size_Products.findOne({
            size_id: idSizeBefore.id,
            product_id: product.id,
          }).then((sizeProduct) => {
            return sizeProduct.update({
              size_id: idSize.id,
              product_id: product.id,
            });
          });
        }
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
    if (foto_6 && foto_6 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_6,
      });
    }
    if (foto_7 && foto_7 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_7,
      });
    }
    if (foto_8 && foto_8 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_8,
      });
    }
    if (foto_9 && foto_9 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_9,
      });
    }
    if (foto_10 && foto_10 != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: foto_10,
      });
    }
    if (video && video != null) {
      M_Photo_Products.create({
        product_id: product.id,
        nama_file: video,
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
      process.env.URL_API_POS_DEV + "get-barang"
    );

    const syncDataProduct = response.data.data;

    for (const product of syncDataProduct) {
      const existingProduct = await M_Products.findOne({
        where: { artikel: product.artikel },
      });

      if (!existingProduct) {
        const createdProduct = await M_Products.create({
          uuid: uuidv4(),
          category_id: 4,
          nama_barang: product.nama_barang,
          artikel: product.artikel,
          harga: product.harga,
        });

        for (const variant of product.varian_barang) {
          let existingVariant = await M_Variations.findOne({
            where: { variasi: variant.nama_varian },
          });

          if (!existingVariant) {
            existingVariant = await M_Variations.create({
              variasi: variant.nama_varian,
            });
          }

          const existingVariantProduct = await M_Variation_Products.findOne({
            where: {
              variation_id: existingVariant.id,
              product_id: createdProduct.id,
            },
          });

          if (!existingVariantProduct) {
            await M_Variation_Products.create({
              variation_id: existingVariant.id,
              product_id: createdProduct.id,
            });
          }

          for (const harga of product.harga_barang) {
            await M_Variant_Product_Detail.create({
              variation_id: existingVariant.id,
              product_id: createdProduct.id,
              variasi_detail: variant.nama_varian,
              warna: harga.warna,
              ukuran: harga.ukuran,
              lain_lain: harga.lain_lain,
              harga: harga.harga,
            });
          }

          for (const stok of product.stok_barang) {
            await T_Stocks.create({
              variation_id: existingVariant.id,
              product_id: createdProduct.id,
              variasi_detail: variant.nama_varian,
              warna: stok.warna,
              ukuran: stok.ukuran,
              lain_lain: stok.lain_lain,
              stock: stok.stok,
            });
          }
        }
      }
    }

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
