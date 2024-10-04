const asyncHandler = require("express-async-handler");
const {
  sequelize,
  M_Products,
  M_Customers,
  M_Variant_Product_Detail,
  T_Stocks,
  T_Carts,
  T_Cart_Details,
  T_Transaksies,
  T_Transaksi_Details,
  User_Ecommerces
} = require("../../../models/");
const { v4: uuidv4 } = require("uuid");

const getHistoryTransaction = asyncHandler(async (req, res) => {
    try {
        const user = await User_Ecommerces.findOne({
            where: { no_telepon: req.user.username }
        });
        let id = user.id

        const query = `
            SELECT
                t.kode_invoice, 
                td.id,
                td.variation_id,
                p.uuid,
                p.nama_barang AS 'nama_barang',
                t.user_ecommerce_id,
                t.createdAt,
                t.konfirmasi_admin,
                td.product_id,
                td.total_harga,
                td.qty,
                td.ukuran,
                td.warna,
                v.variasi AS 'variasi',
                ue.name,
                c.alamat,
                me.ekspedisi
            FROM 
                T_Transaksies as t
            INNER JOIN 
                T_Transaksi_Details as td ON t.id = td.transaksi_id AND td.deletedAt IS NULL
            INNER JOIN 
                M_Products as p ON td.product_id = p.id AND p.deletedAt IS NULL
            INNER JOIN
                User_Ecommerces as ue ON ue.id = t.user_ecommerce_id
            INNER JOIN
                M_Ekspedisis as me ON me.id = t.ekspedisi_id
            LEFT JOIN
                m_customers as c ON c.user_ecommerce_id = t.user_ecommerce_id
            LEFT JOIN 
                M_Variations as v ON td.variation_id = v.id AND v.deletedAt IS NULL
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

        return res.status(200).json({
            message: "Get Data Success!",
            data: transactions,
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
        });
    }
})

module.exports = {
    getHistoryTransaction
}