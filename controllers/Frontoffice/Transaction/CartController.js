const asyncHandler = require("express-async-handler");
const { Op } = require('sequelize')
const {
  sequelize,
  M_Products,
  M_Variations,
  M_Variation_Products,
  M_Variant_Product_Detail,
  T_Wishlist,
  T_Wishlist_Details,
  M_Photo_Products,
  M_Sizes,
  M_Size_Products,
  T_Carts,
  T_Cart_Details,
  User_Ecommerces,
  T_Stocks,
  M_Discount_Categories,
  M_Discount_Products
} = require("../../../models/");
const { v4: uuidv4 } = require("uuid");
const { default: axios } = require("axios");

const getCart = asyncHandler(async (req, res) => {
    try {
        const user = await User_Ecommerces.findOne({
            where: { no_telepon: req.user.username }
        });
        let id = user.id

        const query = `
            SELECT  DISTINCT
                cd.id,
                cd.variant_id,
                cd.varian,
                cd.warna,
                cd.ukuran,
                p.uuid,
                p.nama_barang AS 'nama_barang',
                p.image,
                c.user_ecommerce_id,
                c.status,
                c.createdAt,
                cd.product_id,
                cd.variant_id,
                cd.qty,
                v.variasi AS 'variasi',
                vpd.harga AS 'harga'
            FROM 
                T_Carts as c
            INNER JOIN 
                T_Cart_Details as cd ON c.id = cd.cart_id AND cd.deletedAt IS NULL
            INNER JOIN 
                M_Products as p ON cd.product_id = p.id AND p.deletedAt IS NULL
            LEFT JOIN 
                M_Variations as v ON cd.variant_id = v.id AND v.deletedAt IS NULL
            LEFT JOIN 
                M_Variant_Product_Details as vpd ON v.id = vpd.variation_id AND vpd.deletedAt IS NULL AND p.id = vpd.product_id AND vpd.deletedAt IS NULL
            WHERE 
                cd.deletedAt IS NULL 
                AND c.user_ecommerce_id = :id
            GROUP BY
                cd.id
            ORDER BY 
                cd.id;
        `;

        const carts = await sequelize.query(query, {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT
        });
      
        return res.status(200).json({
            message: "Get Data Success!",
            data: carts,
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
        });
    }
})

const createCart = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const currentDate = new Date();

        const user = await User_Ecommerces.findOne({
            where: { no_telepon: req.user.username }
          });

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

        const checkCart = await T_Carts.findOne({
            where: {user_ecommerce_id: user.id}
        })

        let checkQty = await T_Stocks.findOne({
          where: {
            product_id: product.id,
            variation_id: product['M_Variations'][0]['id'],
          },
          attributes: ['stock']
        })

        if(checkQty.stock <= 0){
          return res.status(200).json({
            message: `Stok Pada Produk ${product.artikel} Habis!`,
            status: false
          });
        }

        let hargaProduct = product.harga;
        const checkDiscountCategory = await M_Discount_Categories.findOne({
          where: {
            category_id: product.category_id,
            start_date: {
              [Op.lte]: currentDate
            },
            end_Date: {
              [Op.gte]: currentDate
            }
          },
        });

        if(checkDiscountCategory){
          if (checkDiscountCategory.diskon_persen != null && checkDiscountCategory.diskon_persen != 0) {
            let discount = product.harga * (checkDiscountCategory.diskon_persen / 100);
            hargaProduct -= discount;
          }
          if (checkDiscountCategory.diskon_harga != null && checkDiscountCategory.diskon_harga != 0) {
            hargaProduct -= checkDiscountCategory.diskon_harga;
          }
        }

        const checkDiscountProduct = await M_Discount_Products.findOne({
          where: {
            product_id: product.id,
            start_date: {
              [Op.lte]: currentDate
            },
            end_Date: {
              [Op.gte]: currentDate
            }
          },
        });

        if (checkDiscountProduct) {
          if (checkDiscountProduct.diskon_persen != null && checkDiscountProduct.diskon_persen != 0) {
              let discount = product.harga * (checkDiscountProduct.diskon_persen / 100);
              hargaProduct -= discount;
          }
          if (checkDiscountProduct.diskon_harga != null && checkDiscountProduct.diskon_harga != 0) {
              hargaProduct -= checkDiscountProduct.diskon_harga;
          }
        }

        if(!checkCart){
            const cart = await T_Carts.create({
                user_ecommerce_id: user.id,
                status: 0
            });
            const cartDetail = await T_Cart_Details.create({
                cart_id: cart.id,
                product_id: product.id,
                variant_id: product['M_Variations'][0]['id'],
                price: hargaProduct,
                qty: 1
            })
        }else{
            const cartDetail = await T_Cart_Details.create({
                cart_id: checkCart.id,
                product_id: product.id,
                variant_id: product['M_Variations'][0]['id'],
                price: hargaProduct,
                qty: 1
            })
        }


        return res.status(200).json({
          message: "Send To Cart Success!",
          status: true
        });        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
        });
      }
})

const createWishlistCart = asyncHandler(async (req, res) => {
    try {
        const { id, uuid, variant_id, warna, ukuran } = req.params;

        const user = await User_Ecommerces.findOne({
            where: { no_telepon: req.user.username }
        });

        const product = await M_Products.findOne({
            where: {
                uuid: uuid,
                deletedAt: null,
            }
        });

        const checkWishlistDetail = await T_Wishlist_Details.findOne({
            where: { id: id,  product_id: product.id, variant_id: variant_id, warna: warna, ukuran: ukuran },
            attributes: ['id', 'product_id', 'variant_id', 'qty', 'varian', 'warna', 'ukuran', 'price'],
        });
        

        const checkCart = await T_Carts.findOne({
            where: {user_ecommerce_id: user.id}
        })

        let checkQty = await T_Stocks.findOne({
          where: {
            product_id: product.id,
            variation_id: checkWishlistDetail.variant_id,
            warna: checkWishlistDetail.warna,
            ukuran: checkWishlistDetail.ukuran
          },
          attributes: ['stock']
        })

        if(checkQty.stock == 0){
          return res.status(200).json({
            message: `Gagal Menambahkan ke Keranjang Anda, Stok Kosong!`,
            status: false,
            stock: checkQty.stock
          });
        }

        if(!checkCart){
            const cart = await T_Carts.create({
                user_ecommerce_id: user.id,
                status: 0
            });

            const cartDetail = await T_Cart_Details.create({
                cart_id: cart.id,
                product_id: checkWishlistDetail.product_id,
                variant_id: checkWishlistDetail.variant_id,
                price: checkWishlistDetail.price,
                qty: (checkWishlistDetail.qty > checkQty.stock) ? checkQty.stock : checkWishlistDetail.qty,
                varian: checkWishlistDetail.varian,
                warna: checkWishlistDetail.warna,
                ukuran: checkWishlistDetail.ukuran,
            })

            let newStock = checkQty.stock - qty;
            await T_Stocks.update(
                { stock: newStock },
                {
                    where: {
                        product_id: product.id,
                        variation_id: variantBarangDetails.variation_id,
                        warna: warna,
                        ukuran: ukuran
                    }
                }
            );
        }else{
          const checkCartDetail = await T_Cart_Details.findOne({
            where: {
              cart_id: checkCart.id,
              product_id: checkWishlistDetail.product_id,
              variant_id: checkWishlistDetail.variant_id,
              varian: checkWishlistDetail.varian,
              warna: checkWishlistDetail.warna,
              ukuran: checkWishlistDetail.ukuran,
              deletedAt: null
            }
          });

          if(checkCartDetail){
            return res.status(400).json({
              message: `Gagal menambahkan ke keranjang. Produk ini sudah ada di keranjang Anda!`,
              status: false,
              stock: checkQty.stock
            });
          }
            
          const cartDetail = await T_Cart_Details.create({
              cart_id: checkCart.id,
              product_id: checkWishlistDetail.product_id,
              variant_id: checkWishlistDetail.variant_id,
              price: checkWishlistDetail.price,
              qty: (checkWishlistDetail.qty > checkQty.stock) ? checkQty.stock : checkWishlistDetail.qty,
              varian: checkWishlistDetail.varian,
              warna: checkWishlistDetail.warna,
              ukuran: checkWishlistDetail.ukuran,
          })

            
          let newStock = checkQty.stock - qty;
          await T_Stocks.update(
              { stock: newStock },
              {
                  where: {
                      product_id: product.id,
                      variation_id: variantBarangDetails.variation_id,
                      warna: warna,
                      ukuran: ukuran
                  }
              }
          );
        }

        await T_Wishlist_Details.destroy({
            where: { id: id,  product_id: product.id, variant_id: variant_id }
        });

        const checkNull = T_Wishlist_Details.findAll({
            where: {wishlist_id: wishlistDetail.wishlist_id},
            attributes: ['id']
        });   
        
        if(checkNull.length == 0){
            await T_Wishlist.destroy({
              where: { id: checkWishlistDetail.wishlist_id }
            });
        }

        if(checkWishlistDetail.qty > checkQty.stock){
          return res.status(400).json({
            message: `Gagal Menambahkan ke Keranjang Anda, Stok Hanya Tersedia Sebanyak: ${checkQty.stock}!`,
            status: false,
            stock: checkQty.stock
          });
        }else{
          return res.status(200).json({
            message: "Berhasil Menambahkan ke Keranjang Anda, Silahkan Checkout!",
            status: true
          });        
        }  
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
          stock: 0
        });
      }
})

const updateCart = asyncHandler(async (req, res) => {
    try {
        const { id, uuid, variant_id } = req.params;
        const { qty } = req.body;

        const user = await User_Ecommerces.findOne({
            where: { no_telepon: req.user.username }
        });

        const product = await M_Products.findOne({
            where: {
              uuid: uuid
            }
        });

        if (!user || !product) {
            return res.status(404).json({
                message: "User atau produk tidak ditemukan!",
                status: false,
            });
        }

        const getCart = await T_Carts.findOne({
            where: {user_ecommerce_id: user.id}
        })

        if (!getCart) {
            return res.status(404).json({
                message: "Keranjang tidak ditemukan!",
                status: false,
            });
        }
        

        const updateDetail = await T_Cart_Details.findOne({
            where: { 
              id:id, 
              cart_id: getCart.id, 
              product_id: product.id, 
              varian: variant_id 
            },
        })
        // console.log(updateDetail)

        if (!updateDetail) {
            return res.status(404).json({
                message: "Detail keranjang tidak ditemukan!",
                status: false,
            });
        }

        let checkQty = await T_Stocks.findOne({
          where: {
            product_id: product.id,
            variation_id: updateDetail.variant_id,
            warna: updateDetail.warna,
            ukuran: updateDetail.ukuran
          },
          attributes: ['stock']
        })
        console.log(product.id)
        console.log(updateDetail.variant_id)
        console.log(updateDetail.warna)
        console.log(updateDetail.ukuran)

        let newQty = parseInt(qty, 10);
        if(newQty > checkQty.stock){
          newQty = checkQty.stock
        }
        

        if (qty > checkQty.stock) {
          return res.status(200).json({
            message: `Gagal Menambahkan ke Keranjang Anda, Stok Hanya Tersedia Sebanyak: ${checkQty.stock}!`,
            status: false,
            stock: checkQty.stock,
            stokKurang: true,
            totalHarga: totalHarga,
          });
        } else {
          const update = await T_Cart_Details.update(
              { qty: newQty },
              { 
                where: { 
                  id: id, 
                  cart_id: getCart.id, 
                  product_id: product.id, 
                  varian: variant_id 
                } 
              }
          );
          
          const cartDetails = await T_Cart_Details.findAll({
              where: { cart_id: getCart.id, deletedAt: null }
          });

          let newStock = checkQty.stock + updateDetail.qty - qty;
          await T_Stocks.update(
              { stock: newStock },
              {
                  where: {
                      product_id: product.id,
                      variation_id: updateDetail.variant_id,
                      warna: updateDetail.warna,
                      ukuran: updateDetail.ukuran
                  }
              }
          );
          
          let totalHarga = 0;
          for (let detail of cartDetails) {
              totalHarga += detail.price * detail.qty;
          }

          return res.status(200).json({
            message: "Qty produk berhasil diupdate, Silakan lanjutkan ke checkout!",
            status: true,
            totalHarga: totalHarga,
            newQty: newQty,
            stokKurang: false
          });
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
        });
    }
})

const deleteCart = asyncHandler(async (req, res) => {
  console.log('masuk deleteCart')
    try {
      const { id } = req.params;
  
      const CartDetail = await T_Cart_Details.findOne({
        where: {id: id},
        attributes: ['id', 'cart_id', 'product_id', 'variant_id', 'price', 'qty']
      });
  
      if(!CartDetail){
        return res.status(200).json({
          message: "Hapus Data Gagal! Data Sudah Terhapus!",
          status: false
        });
      }
  
      const checkCartDetail = await T_Cart_Details.findAll({
        where: {cart_id: CartDetail.cart_id}
      });

      for (const item of checkCartDetail) {
        let checkQty = await T_Stocks.findOne({
            where: {
                product_id: item.product_id,
                variation_id: item.variant_id,
                warna: item.warna,
                ukuran: item.ukuran
            },
            attributes: ['stock']
        });
    
        if (checkQty) {
            let addStockCartDetail = checkQty.stock + item.qty;
    
            await T_Stocks.update(
                { stock: addStockCartDetail },
                {
                    where: {
                        product_id: item.product_id,
                        variation_id: item.variant_id,
                        warna: item.warna,
                        ukuran: item.ukuran
                    }
                }
            );
        }
      }
  
      await T_Cart_Details.destroy({
        where: {id: CartDetail.id}
      });
  
      if(checkCartDetail.length == 0){
        await T_Carts.destroy({
          where: { id: CartDetail.cart_id }
        });
      }
  
      return res.status(200).json({
        message: "Delete Data Success!",
        status: true
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({
        message: "Internal Server Error! Please Contact Developer",
        status: false,
      });
    }
})

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
  
      return res.status(200).json(variantBarangDetails);
      
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      return res.status(500).json({
        message: "Internal Server Error! Please Contact Developer",
        status: false,
      });
    }
  });
  
const getWarnaById = asyncHandler(async(req, res) => {
  try {
    const { product_id, variant_id, cart } = req.params;
    const productDetail = await M_Products.findOne({
      where: {
        uuid: product_id
      }
    })

    await T_Cart_Details.update({
      varian: variant_id,
    }, {
      where: {
        id: cart,
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

    return res.status(200).json(variantBarangDetails);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
})
  
const getUkuranById = asyncHandler(async(req, res) => {
  try {
    const { product_id, variant_id, warna, cart } = req.params;
    const productDetail = await M_Products.findOne({
      where: {
        uuid: product_id
      }
    })

    await T_Cart_Details.update({
      warna: warna
    }, {
      where: {
        id: cart,
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
    
    return res.status(200).json(variantBarangDetails);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
})
  
const getHargaById = asyncHandler(async(req, res) => {
  try {
    const { product_id, variant_id,  warna, ukuran, cart} = req.params;
    const currentDate = new Date();

    const productDetail = await M_Products.findOne({
      where: {
        uuid: product_id
      }
    })

    await T_Cart_Details.update({
      ukuran: ukuran,
    }, {
      where: {
        id: cart,
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

    let hargaProduct = variantBarangDetails.harga;
    const checkDiscountCategory = await M_Discount_Categories.findOne({
      where: {
        category_id: productDetail.category_id,
        start_date: {
          [Op.lte]: currentDate
        },
        end_Date: {
          [Op.gte]: currentDate
        }
      },
    });

    if(checkDiscountCategory){
      if (checkDiscountCategory.diskon_persen != null && checkDiscountCategory.diskon_persen != 0) {
        let discount = variantBarangDetails.harga * (checkDiscountCategory.diskon_persen / 100);
        hargaProduct -= discount;
      }
      if (checkDiscountCategory.diskon_harga != null && checkDiscountCategory.diskon_harga != 0) {
        hargaProduct -= checkDiscountCategory.diskon_harga;
      }
    }

    const checkDiscountProduct = await M_Discount_Products.findOne({
      where: {
        product_id: productDetail.id,
        start_date: {
          [Op.lte]: currentDate
        },
        end_Date: {
          [Op.gte]: currentDate
        }
      },
    });

    if (checkDiscountProduct) {
      if (checkDiscountProduct.diskon_persen != null && checkDiscountProduct.diskon_persen != 0) {
          let discount = productDetail.harga * (checkDiscountProduct.diskon_persen / 100);
          hargaProduct -= discount;
      }
      if (checkDiscountProduct.diskon_harga != null && checkDiscountProduct.diskon_harga != 0) {
          hargaProduct -= checkDiscountProduct.diskon_harga;
      }
    }

    await T_Cart_Details.update({
      price: hargaProduct
    }, {
      where: {
        id: cart,
        product_id: productDetail.id,
        varian: variant_id,
        warna: warna,
        ukuran: ukuran
      }
    })
    
    console.log('get-harga hargaProduct:'+hargaProduct);
    
    let arrayData = {
      harga: hargaProduct,
      variant_id: variantBarangDetails.variation_id
    }
    return res.status(200).json(arrayData);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
})

const duplicateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const getCartDetail = await T_Cart_Details.findOne({
      where: {
        id: id
      }
    })

    if (!getCartDetail) {
      return res.status(404).json({
          message: "Detail keranjang tidak ditemukan!",
          status: false,
      });
    }

    const getDuplicateProduct = await T_Cart_Details.create({
      cart_id   : getCartDetail.cart_id,
      product_id: getCartDetail.product_id,
      variant_id: getCartDetail.variant_id,
      price     : getCartDetail.price,
      qty       : 1,
      varian    : getCartDetail.varian,
      warna     : getCartDetail.warna,
      ukuran    : getCartDetail.ukuran
    })

    // const variants = await M_Variant_Product_Detail.findAll({
    //   where: {
    //     product_id: getCartDetail.product_id
    //   },
    //   attributes: ['variasi_detail'],
    //   group: ['variasi_detail']
    // })

    // const warnas = await M_Variant_Product_Detail.findAll({
    //   where: {
    //     product_id: getCartDetail.product_id,
    //     variasi_detail: getCartDetail.varian
    //   },
    //   attributes: ['warna']
    // })

    // const ukurans = await M_Variant_Product_Detail.findAll({
    //   where: {
    //     product_id: getCartDetail.product_id,
    //     variasi_detail: getCartDetail.varian,
    //     warna: getCartDetail.warna
    //   },
    //   attributes: ['warna']
    // })

    return res.status(200).json({
      message: "Duplicate Product Cart Success!",
      status: true,
      product: getDuplicateProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
})

const createCartByDetailProduct = asyncHandler(async (req, res) => {
  try {
      const { product_id, variant_id, warna, ukuran, qty } = req.params;

      const user = await User_Ecommerces.findOne({
          where: { no_telepon: req.user.username }
      });

      const product = await M_Products.findOne({
          where: {
              uuid: product_id,
              deletedAt: null,
          }
      });

      const checkCart = await T_Carts.findOne({
          where: {user_ecommerce_id: user.id, status: 0}
      })

      const variantBarangDetails = await M_Variant_Product_Detail.findOne({
        where: {
          product_id: product.id,
          variasi_detail: variant_id,
          warna: warna,
          ukuran: ukuran
        },
      })

      let checkQty = await T_Stocks.findOne({
        where: {
          product_id: product.id,
          variation_id: variantBarangDetails.variation_id,
          warna: warna,
          ukuran: ukuran
        },
        attributes: ['stock']
      })

      // check when is null
      if(checkQty.stock == 0){
        return res.status(200).json({
          message: `Gagal Menambahkan ke Keranjang Anda, Stok Kosong!`,
          status: false,
          stock: checkQty.stock
        });
      }

      if(!checkCart){
          const cart = await T_Carts.create({
              user_ecommerce_id: user.id,
              status: 0
          });
          const cartDetail = await T_Cart_Details.create({
              cart_id: cart.id,
              product_id: product.id,
              variant_id: variantBarangDetails.variation_id,
              price     : variantBarangDetails.harga,
              qty       : (qty > checkQty.stock) ? checkQty.stock : qty,
              varian: variant_id,
              warna: warna,
              ukuran: ukuran
          })

          let newStock = checkQty.stock - qty;
          await T_Stocks.update(
            { stock: newStock },
            {
                where: {
                    product_id: product.id,
                    variation_id: variantBarangDetails.variation_id,
                    warna: warna,
                    ukuran: ukuran
                }
            }
          );
      }else{
        console.log("Msuk else cart controller, warna: "+warna)
        const checkCartDetail = await T_Cart_Details.findOne({
          where: {
            cart_id: checkCart.id,
            product_id: product.id,
            variant_id: variantBarangDetails.variation_id,
            varian: variant_id,
            warna: warna,
            ukuran: ukuran,
            deletedAt: null
          }
        });
        console.log(checkCartDetail)

        if(checkCartDetail){
          return res.status(400).json({
            message: `Gagal menambahkan ke keranjang. Produk ini sudah ada di keranjang Anda!`,
            status: false,
            stock: checkQty.stock
          });
        }

        const cartDetail = await T_Cart_Details.create({
            cart_id: checkCart.id,
            product_id: product.id,
            variant_id: variantBarangDetails.variation_id,
            price     : variantBarangDetails.harga,
            qty       : (qty > checkQty.stock) ? checkQty.stock : qty,
            varian: variant_id,
            warna: warna,
            ukuran: ukuran
        })

        let newStock = checkQty.stock - qty;
        await T_Stocks.update(
            { stock: newStock },
            {
                where: {
                    product_id: product.id,
                    variation_id: variantBarangDetails.variation_id,
                    warna: warna,
                    ukuran: ukuran
                }
            }
        );
      }

      if(qty > checkQty.stock){
        return res.status(200).json({
          message: `Gagal Menambahkan ke Keranjang Anda, Stok Hanya Tersedia Sebanyak: ${checkQty.stock}!`,
          status: false,
          stock: checkQty.stock
        });
      }else{
        return res.status(200).json({
          message: "Berhasil Menambahkan ke Keranjang Anda, Silahkan Checkout!",
          status: true
        });        
      }      

  } catch (error) {
      console.log('masuk error')
      console.error(error.message);
      return res.status(500).json({
        message: "Internal Server Error! Please Contact Developer",
        status: false,
        stock: 0
      });
    }
})

module.exports = {
    createCart,
    createWishlistCart,
    getCart,
    updateCart,
    deleteCart,
    getVarianById,
    getWarnaById,
    getUkuranById,
    getHargaById,
    duplicateProduct,
    createCartByDetailProduct
};