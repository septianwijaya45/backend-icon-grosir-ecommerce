const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const {
    T_Transaksies,
    T_Transaksi_Detail
} = require('../../../models');

const getMyOrder = asyncHandler(async(req, res) => {
    try {
        const user = await User_Ecommerces.findOne({
            where: { no_telepon: req.user.username }
        });
        let id = user.id;
        const formattedNoTelepon = user.no_telepon.startsWith('0') ? '62' + user.no_telepon.slice(1) : user.no_telepon;

        const transaction = await T_Transaksies.findOne({
            where: {
                user_ecommerce_id: id,
                tanggal_checkout: {
                    [Op.ne]: null
                }
            }
        })
        
        const query = `
            SELECT 
                t.user_ecommerce_id,
                t.konfirmasi_admin,
                t.createdAt,
                td.id,
                td.variation_id,
                p.uuid,
                p.nama_barang AS 'nama_barang',
                td.product_id,
                td.qty,
                v.variasi AS 'variasi',
                vpd.warna AS 'warna',
                vpd.ukuran AS 'ukuran',
                vpd.lain_lain AS 'lain_lain',
                vpd.harga AS 'harga'
            FROM 
                t_transaksies as t
            INNER JOIN 
                t_transaksi_details as td ON t.id = td.transaksi_id AND td.deletedAt IS NULL
            INNER JOIN 
                M_Products as p ON td.product_id = p.id AND p.deletedAt IS NULL
            LEFT JOIN 
                M_Variations as v ON td.variation_id = v.id AND v.deletedAt IS NULL
            LEFT JOIN 
                M_Variant_Product_Details as vpd ON v.id = vpd.variation_id AND vpd.deletedAt IS NULL AND p.id = vpd.product_id AND vpd.deletedAt IS NULL
            WHERE 
                td.deletedAt IS NULL 
                AND t.tanggal_checkout IS NOT NULL
                AND t.user_ecommerce_id = :id
            ORDER BY 
                td.id;
        `;

        const transactions = await sequelize.query(query, {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({
            message: "Get Data Success!",
            data: transactions,
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
        });
    }
})

module.exports = {
    getMyOrder
}