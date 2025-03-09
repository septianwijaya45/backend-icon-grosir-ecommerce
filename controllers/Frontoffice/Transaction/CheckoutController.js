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

const countInvoice = async (req, res) => {
    const countTransaction = await T_Transaksies.count({
        where: { deletedAt: null },
        attributes: ['id', 'kode_invoice']
    });

    const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formatter = new Intl.DateTimeFormat('en-US', options);

    const randNumber = Math.floor(Math.random() * 90000) + 10000;;

    const [
        { value: month },,
        { value: day },,
        { value: year },,
        { value: hour },,
        { value: minute },,
        { value: second }
    ] = formatter.formatToParts(new Date());

    const invoiceNumber = `INV${day}${month}${randNumber}${countTransaction + 1}`;

    return invoiceNumber;
};


const getTransaksi = asyncHandler(async (req, res) => {
    try {
        const user = await User_Ecommerces.findOne({
            where: { no_telepon: req.user.username }
        });
        let id = user.id
        const transaction = await T_Transaksies.findOne({
            where: {
                user_ecommerce_id: user.id,
                tanggal_checkout: null,
                ekspedisi_id: null
            }
        })

        const query = `
            SELECT
                td.id,
                td.variation_id,
                p.uuid,
                p.nama_barang AS 'nama_barang',
                td.product_id,
                td.qty,
                v.variasi AS 'variasi',
                td.warna AS 'warna',
                td.ukuran AS 'ukuran',
                td.lain_lain AS 'lain_lain',
                td.total_harga AS 'harga'
            FROM 
                T_Transaksi_Details as td
            INNER JOIN 
                M_Products as p ON td.product_id = p.id AND p.deletedAt IS NULL
            LEFT JOIN 
                M_Variations as v ON td.variation_id = v.id AND v.deletedAt IS NULL
            LEFT JOIN 
                (SELECT * FROM M_Variant_Product_Details WHERE deletedAt IS NULL GROUP BY variation_id, product_id) as vpd
                ON v.id = vpd.variation_id AND p.id = vpd.product_id
            WHERE 
                td.deletedAt IS NULL 
                AND td.transaksi_id = :transaction_id
            ORDER BY 
                td.id;;
        `;

        let transaction_id = 0
        if(transaction){
            transaction_id = transaction.id
        }
        const transactions = await sequelize.query(query, {
            replacements: { transaction_id },
            type: sequelize.QueryTypes.SELECT
        });

        return res.status(200).json({
            message: "Get Data Success!",
            transaction: transaction,
            data: transactions
        });

    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
        });
    }
})

const createCheckout = asyncHandler(async(req, res) => {
    try {
        const user = await User_Ecommerces.findOne({
            where: { no_telepon: req.user.username }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: false,
            });
        }

        const invoiceNumber = await countInvoice();

        let id = user.id

        const card = await T_Carts.findOne({
            where: {user_ecommerce_id: id}
        });

        const cartDetails = await T_Cart_Details.findAll({
            where: { cart_id: card.id, deletedAt: null }
        });

        let totalHarga = 0;
        for (let detail of cartDetails) {
            totalHarga += detail.price * detail.qty;
        }

        const transaction = await T_Transaksies.create({
            uuid: uuidv4(),
            user_ecommerce_id: id,
            kode_invoice: invoiceNumber,
            grand_total: totalHarga,
            konfirmasi_admin: 0
        })

        for (let detail of cartDetails){
            // const getVarian = await M_Variant_Product_Detail.findOne({
            //     where: {
            //         variation_id: detail.variant_id,
            //         product_id: detail.product_id
            //     }
            // })

            await T_Transaksi_Details.create({
                transaksi_id: transaction.id,
                product_id: detail.product_id,
                qty: detail.qty,
                total_harga: detail.qty * detail.price,
                variation_id: detail.variant_id,
                warna: detail.warna,
                ukuran: detail.ukuran,
                lain_lain: detail.lain_lain
            })
            
            // const getStock = await T_Stocks.findOne({
            //     where: {
            //         variation_id: detail.variant_id,
            //         product_id: detail.product_id
            //     }
            // })

            // await T_Stocks.update(
            //     { stock: getStock.stock - detail.qty },
            //     {
            //         where: {
            //             variation_id: detail.variant_id,
            //             product_id: detail.product_id
            //         }
            //     }
            // )
        }

        await T_Cart_Details.destroy({
            where: { 
                cart_id: card.id, deletedAt: null
            },
        });
        
        await T_Carts.update(
            { 
                status: 1
            },
            {
                where: {
                    id: card.id,
                    user_ecommerce_id: id,
                }
            }
        );

        return res.status(200).json({
            message: "Berhasil memasukkan ke checkout!",
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

const processCheckout = asyncHandler(async(req, res) => {
    try {
        const { ekspedisi_id, kota, kode_pos, alamat } = req.body;
        const user = await User_Ecommerces.findOne({
            where: { no_telepon: req.user.username }
        });
        let id = user.id;
        const formattedNoTelepon = user.no_telepon.startsWith('0') ? '62' + user.no_telepon.slice(1) : user.no_telepon;

        const findCustomer = await M_Customers.findOne({
            where: { user_ecommerce_id: user.id }
        })

        if(findCustomer == null){
            await M_Customers.create({
                user_ecommerce_id: id,
                first_name: user.username,
                no_telepon: user.no_telepon,
                alamat: alamat,
                kota: kota,
                kode_pos: kode_pos
            })
        }else{
            await M_Customers.update({
                alamat: alamat,
                kota: kota,
                kode_pos: kode_pos
            }, {
                where: {
                    user_ecommerce_id: user.id
                }
            })
        }

        const customer = await M_Customers.findOne({
            where: { user_ecommerce_id: user.id }
        })

        const transaction = await T_Transaksies.findOne({
            where: {
                user_ecommerce_id: id,
                tanggal_checkout: null,
                ekspedisi_id: null
            }
        });

        const transactionDetails = await T_Transaksi_Details.findAll({
            where: { transaksi_id: transaction.id, deletedAt: null },
        });

        let orderDetails = '';
        let no = 0;
        for (let detail of transactionDetails) {
            const product = await M_Products.findOne({ where: { id: detail.product_id } });
            const variant = await M_Variant_Product_Detail.findOne({ 
                where: { 
                    variation_id: detail.variation_id, 
                    product_id: detail.product_id
                } 
            });

            orderDetails += `${no += 1}. ${product.nama_barang} (${variant.variasi_detail}) - ${detail.warna} | ukuran: ${detail.ukuran} sebanyak Qty: ${detail.qty}\n`;
        }

        const message = `Hallo Permisi,\nSaya ${user.name} ingin memesan produk yang sudah saya checkout melalui aplikasi website icongrosir.com dengan detail ini:\n${orderDetails}\nMohon bisa diproses di alamat saya ya:\n${customer.alamat}\n\nTerima Kasih`;

        await T_Transaksies.update(
            { 
                tanggal_checkout: new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
                ekspedisi_id: ekspedisi_id
            },
            { 
                where: {
                    user_ecommerce_id: id, 
                    ekspedisi_id: null,
                    tanggal_checkout: null
                }
            }
        );

        return res.status(200).json({
            message: "Anda berhasil checkout pesanan! Silahkan tunggu konfirmasi dari admin.",
            status: true,
            sendMessage: message
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
    createCheckout,
    processCheckout
}