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
    let query = `SELECT p.*,
       (SELECT JSON_ARRAYAGG(
           JSON_OBJECT(
               'variasi_detail', vpd.variasi_detail, 
               'warna', vpd.warna, 
               'ukuran', vpd.ukuran, 
               'harga', vpd.harga
           )
        )
        FROM M_Variant_Product_Details vpd
        WHERE vpd.product_id = p.id AND vpd.deletedAt IS NULL
       ) AS details
      FROM M_Products p
      LEFT JOIN M_Variation_Products vp ON p.id = vp.product_id
      LEFT JOIN M_Variations v ON v.id = vp.variation_id
      WHERE p.deletedAt IS NULL
        AND vp.deletedAt IS NULL
      GROUP BY p.artikel;
    `
    const products = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT
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
      satuan_berat,
      varian,
      warna,
      ukuran,
      harga,
      stok,
      foto,
      image,
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
      satuan_berat: satuan_berat,
      image: image,
      video:video,
      harga: harga[0]
    };

    let checkProduct = await M_Products.findOne({
      where:{
        artikel: artikel
      }
    })

    if(checkProduct){
      res.status(200).json({
        status: false,
        message: "Berhasil Menyimpan Data!"
      });
    }

    const product = await M_Products.create(dataProduct);

    if (varian.length != 0) {
      for (let i = 0; i < varian.length; i++) {
        let getVarian = await M_Variations.findOne({
          where: { id: varian[i] },
        });

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
            harga: harga[i],
          });
  
          await T_Stocks.create({
            variation_id: getVarian.id,
            product_id: product.id,
            warna: warna[i],
            ukuran: ukuran[i],
            stock: stok[i],
          });

          if (foto && foto != null) {
            let getVarianProductDetail = await M_Variant_Product_Detail.findOne({
              where: { 
                variation_id: getVarian.id,
                product_id: product.id,
                variasi_detail: getVarian.variasi,
                warna: warna[i],
                ukuran: ukuran[i],
                harga: harga[i],
              },
            });
            await M_Photo_Products.create({
              product_id: product.id,
              varian_product_detail_id: getVarianProductDetail.id,
              nama_file: foto[i],
            });
          }
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


    res.status(200).json({
      status: true,
      message: "Berhasil Menyimpan Data!",
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
        {
          model: M_Photo_Products,
          as: "photos",
          where: { product_id: product.id },
          required: false
        }
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
      satuan_berat,
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
      foto,
      image,
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
      satuan_berat: satuan_berat,
      harga: harga[0]
    };

    if (image) {
      dataProduct.image = image;
    }
    
    if (video) {
      dataProduct.video = video;
    }

    const product = await M_Products.findOne({ where: { uuid: uuid } });

    const updateProduct = await M_Products.update(dataProduct, {
      where: {
        uuid: uuid,
      },
    });

    if (varian.length != 0) {
      for (let i = 0; i < varian.length; i++) {
        let getVarian = await M_Variations.findOne({
          where: { id: varian[i] },
        });

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
            },
          }).then((variantProductDetail) => {
            return variantProductDetail.update({
              variation_id: getVarian.id,
              product_id: product.id,
              variasi_detail: getVarian.variasi,
              warna: warna[i],
              ukuran: ukuran[i],
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
            },
          }).then((stok) => {
            return stok.update({
              variation_id: getVarian.id,
              product_id: product.id,
              warna: warna[i],
              ukuran: ukuran[i],
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
            harga: harga[i],
          });

          await T_Stocks.create({
            variation_id: getVarian.id,
            product_id: product.id,
            warna: warna[i],
            ukuran: ukuran[i],
            stock: stok[i],
          });
        }

        if (foto && foto != null && foto.length != 0) {
          let getVarianProductDetail = await M_Variant_Product_Detail.findOne({
            where: { 
              variation_id: getVarian.id,
              product_id: product.id,
              variasi_detail: getVarian.variasi,
              warna: warna[i],
              ukuran: ukuran[i],
              harga: harga[i],
            },
          });

          // delete foto sebelumnya
          let checkProduct = await M_Photo_Products.findOne({
            where: {
              product_id: product.id,
              varian_product_detail_id: getVarianProductDetail.id,
            }
          });

          if(checkProduct){
            await M_Photo_Products.destroy({
              where: {
                product_id: product.id,
                varian_product_detail_id: getVarianProductDetail.id,
              }
            });            
          }

          if(foto[i] != null && foto[i] != ''){
            await M_Photo_Products.create({
              product_id: product.id,
              varian_product_detail_id: getVarianProductDetail.id,
              nama_file: foto[i],
            });
          }
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
          image: product.image,
          harga: product.harga,
        });

        // for (const variant of product.variant_id) {

          let existingVariant = await M_Variations.findOne({
            where: { variasi: product.nama_varian },
          });

          if (!existingVariant) {
            existingVariant = await M_Variations.create({
              variasi: product.nama_varian,
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

          // for (const harga of product.harga) {
            await M_Variant_Product_Detail.create({
              variation_id: existingVariant.id,
              product_id: createdProduct.id,
              variasi_detail: product.nama_varian,
              warna: product.warna,
              ukuran: product.ukuran,
              lain_lain: product.lain_lain,
              harga: product.harga,
            });
          // }

          // for (const stok of product.stok) {
            await T_Stocks.create({
              variation_id: existingVariant.id,
              product_id: createdProduct.id,
              variasi_detail: product.nama_varian,
              warna: product.warna,
              ukuran: product.ukuran,
              lain_lain: product.lain_lain,
              stock: product.stok,
            });
          // }

            console.log('photos product:'+product.photos.length);
            if(product.photos.length != 0){
              for (const photo of product.photos) {
                let photoProduct = await M_Photo_Products.findOne({
                  where: {
                    product_id: createdProduct.id,
                    nama_file: photo.nama_file
                  }
                });
                console.log('cek photoProduct');
                console.log(photoProduct);
                

                if(!photoProduct){
                  await M_Photo_Products.create({
                    product_id: createdProduct.id,
                    nama_file: photo.nama_file
                  })
                }
              }
            }

            if(product.sizes.length != 0){
              for (const sizeProduct of product.sizes) {
                let size = await M_Sizes.findOne({ where: { size: sizeProduct.size } });
                if(!size){
                  size = await M_Sizes.create({
                    size: sizeProduct.size,
                  });
                }
                console.log('cek size');
                console.log(size);
                
    
                await M_Size_Products.create({
                  product_id: createdProduct.id,
                  size_id: size.id
                })
              }
            }
        // }
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
