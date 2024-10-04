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

const getTransaksi = asyncHandler(async (req, res) => {
    try {
        const query = `
            SELECT 
                t.user_ecommerce_id,
                t.kode_invoice,
                t.createdAt,
                CONCAT('Rp ', FORMAT(t.grand_total, 0)) as grand_total,
                DATE_FORMAT(t.tanggal_checkout, '%d %M %Y %H:%i:%s') as tanggal_checkout,
                t.konfirmasi_admin,
                e.ekspedisi,
                ue.name
            FROM 
                T_Transaksies as t
            INNER JOIN
                User_Ecommerces as ue on t.user_ecommerce_id = ue.id
            INNER JOIN
                M_Customers as c on c.user_ecommerce_id = ue.id
            LEFT JOIN
                M_Ekspedisis e on t.ekspedisi_id = e.id
            WHERE 
                t.deletedAt IS NULL 
            ORDER BY 
                t.id desc;
        `;

        const transactions = await sequelize.query(query, {
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

const detailTransaksi = asyncHandler(async(req, res) => {
    try {
        const { kode_invoice, user_id } = req.params;
        let id = user_id;

        const transactions = await T_Transaksies.findOne({
            where: {
                kode_invoice: kode_invoice,
                user_ecommerce_id: user_id,
            }
        });

        if(!transactions){
            return res.status(404).json({
                status: false,
                message: "Data Transaksi "+kode_invoice+" Tidak Ada! Mungkin Telah Terhapus",
            });
        }

        const queryCustomer = `
            SELECT 
                t.user_ecommerce_id,
                t.kode_invoice,
                t.createdAt,
                CONCAT('Rp ', FORMAT(t.grand_total, 0)) as grand_total,
                DATE_FORMAT(t.tanggal_checkout, '%d %M %Y %H:%i:%s') as tanggal_checkout,
                t.konfirmasi_admin,
                e.ekspedisi,
                ue.name,
                ue.email,
                c.no_telepon,
                c.alamat,
                c.kota,
                c.kode_pos
            FROM 
                T_Transaksies as t
            INNER JOIN
                User_Ecommerces as ue on t.user_ecommerce_id = ue.id
            INNER JOIN
                M_Customers as c on c.user_ecommerce_id = ue.id
            LEFT JOIN
                M_Ekspedisis e on t.ekspedisi_id = e.id
            WHERE 
                t.deletedAt IS NULL 
                AND t.user_ecommerce_id = :id
                AND t.kode_invoice = :kode_invoice
            ORDER BY 
                t.id desc;
        `;

        const personalData = await sequelize.query(queryCustomer, {
            replacements: { id, kode_invoice },
            type: sequelize.QueryTypes.SELECT
        });

        const query = `
            SELECT 
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
                T_Transaksies as t
            INNER JOIN 
                T_Transaksi_Details as td ON t.id = td.transaksi_id AND td.deletedAt IS NULL
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
                AND t.kode_invoice = :kode_invoice
            ORDER BY 
                td.id;
        `;

        const dataTransaction = await sequelize.query(query, {
            replacements: { id, kode_invoice },
            type: sequelize.QueryTypes.SELECT
        });

        return res.status(200).json({
            message: "Get Data Success!",
            personalData: personalData[0],
            dataDetails: dataTransaction,
        });

    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
        });
    }
})

const confirmData = asyncHandler(async(req, res) => {
    try {
        const { kode_invoice, user_id } = req.params;

        const transactions = await T_Transaksies.findOne({
            where: {
                kode_invoice: kode_invoice,
                user_ecommerce_id: user_id,
            }
        });

        if(!transactions){
            return res.status(404).json({
                status: false,
                message: "Data Transaksi "+kode_invoice+" Tidak Ada! Mungkin Telah Terhapus",
            });
        }

        await T_Transaksies.update(
            { konfirmasi_admin: 1 },
            {
                where: {
                    kode_invoice: kode_invoice,
                    user_ecommerce_id: user_id,
                }
            }
        );

        return res.status(200).json({
            message: "Anda berhasil konfirmasi pesanan",
            status: true,
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
    getTransaksi,
    detailTransaksi,
    confirmData
}