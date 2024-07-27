const asyncHandler = require("express-async-handler");
const { Op } = require('sequelize')
const {
  sequelize,
  M_Products,
  M_Variations,
  M_Variation_Products,
  User_Ecommerces,
  M_Photo_Products,
  M_Sizes,
  M_Size_Products,
  T_Wishlists,
  T_Wishlist_Details
} = require("../../../models/");
const { v4: uuidv4 } = require("uuid");
const { default: axios } = require("axios");

const createWishlist = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User_Ecommerces.findOne({
          where: { no_telepon: req.user.username }
        });

        // Find the product with variations, sizes, and photos
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
                    }
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

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                status: false,
            });
        }

        const variant_id = product.M_Variations.length > 0 ? product.M_Variations[0].id : null;

        // Find or create wishlist for the user
        let wishlist = await T_Wishlists.findOne({
            where: { user_ecommerce_id:user.id },
            attributes: ['id'],
        });

        if (!wishlist) {
            wishlist = await T_Wishlists.create({
                user_ecommerce_id: user.id,
                status: 0,
            });
        }

        // Check if the product is already in the wishlist
        const checkWishlistDetail = await T_Wishlist_Details.findOne({
            where: { wishlist_id: wishlist.id, product_id: product.id },
            attributes: ['id', 'qty'],
        });

        if (!checkWishlistDetail) {
            await T_Wishlist_Details.create({
                wishlist_id: wishlist.id,
                product_id: product.id,
                variant_id: variant_id,
                price: product.harga,
                qty: 1,
            });
        }else{
          await T_Wishlist_Details.update(
              { qty: checkWishlistDetail.qty + 1 },
              { where: { id: checkWishlistDetail.id } }
          );
        }

        res.status(200).json({
            message: "Send To Wishlist Success!",
            status: true,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal Server Error! Please Contact Developer",
            status: false,
        });
    }
});

const getWishlist = asyncHandler(async (req, res) => {
  try {
    const user = await User_Ecommerces.findOne({
      where: { no_telepon: req.user.username }
    });
    let id = user.id
    
    const query = `
      SELECT 
          wd.id,
          wd.variant_id,
          p.uuid,
          p.nama_barang AS 'nama_barang',
          w.user_ecommerce_id,
          w.status,
          w.createdAt,
          wd.product_id,
          wd.variant_id,
          wd.qty,
          v.variasi AS 'variasi',
          vpd.warna AS 'warna',
          vpd.ukuran AS 'ukuran',
          vpd.lain_lain AS 'lain_lain',
          vpd.harga AS 'harga'
      FROM 
          T_Wishlists as w
      INNER JOIN 
          T_Wishlist_Details as wd ON w.id = wd.wishlist_id AND wd.deletedAt IS NULL
      INNER JOIN 
          M_Products as p ON wd.product_id = p.id AND p.deletedAt IS NULL
      LEFT JOIN 
          M_Variations as v ON wd.variant_id = v.id AND v.deletedAt IS NULL
      LEFT JOIN 
          M_Variant_Product_Details as vpd ON v.id = vpd.variation_id AND vpd.deletedAt IS NULL AND p.id = vpd.product_id AND vpd.deletedAt IS NULL
      WHERE 
          wd.deletedAt IS NULL AND w.user_ecommerce_id = :id
      ORDER BY 
          wd.id;
    `;

    const wishlists = await sequelize.query(query, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });

    res.status(200).json({
      message: "Get Data Success!",
      data: wishlists,
    });
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
});


const deleteWishlist = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const wishlistDetail = await T_Wishlist_Details.findOne({
      where: {id: id},
      attributes: ['id', 'wishlist_id', 'product_id', 'variant_id', 'price', 'qty']
    });

    if(!wishlistDetail){
      res.status(200).json({
        message: "Hapus Data Gagal! Data Sudah Terhapus!",
        status: false
      });
    }

    const checkWishlistDetail = T_Wishlist_Details.findAll({
      where: {wishlist_id: wishlistDetail.wishlist_id},
      attributes: ['id']
    });

    await T_Wishlist_Details.destroy({
      where: {id: wishlistDetail.id}
    });

    if(checkWishlistDetail.length == 0){
      await T_Wishlist.destroy({
        where: { id: wishlistDetail.wishlist_id }
      });
    }

    res.status(200).json({
      message: "Delete Data Success!",
      status: true
    });
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
      status: false,
    });
  }
})
  

module.exports = {
    createWishlist,
    getWishlist,
    deleteWishlist
};
