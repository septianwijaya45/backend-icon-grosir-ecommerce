const asyncHandler = require("express-async-handler");
const { M_Customers, User_Ecommerces } = require("../../../models/");
const { v4: uuidv4 } = require("uuid");

const getAllCustomer = asyncHandler(async (req, res) => {
    try {
        const getDataCustomer = await M_Customers.findAll({
          include: [
            {
              model: User_Ecommerces,
              as: "User_Ecommerces",
              required: true
            },
          ],
        });

        res.status(201).json({
          message: "Get Data Success!",
          data: getDataCustomer,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
        });
    }
});

const createCustomer = asyncHandler(async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            picture,
            first_name,
            last_name,
            no_telepon,
            alamat,
            kota,
            jenis_kelamin,
            kode_pos
        } = req.body

        const emailExists = await User_Ecommerces.findOne({ where: { email : email } });

        if (emailExists) {
          res.status(500).json({
            status: false,
            message: "Email Sudah Terdaftar",
          });
        }

        const account = {
          uuid: uuidv4(),
          role_id: 3,
          name: first_name+' '+ (last_name ? last_name : ''),
          username: username,
          email: email,
          password: password
        };

        const user = await User_Ecommerces.create(account);

        const customerData = {
          user_ecommerce_id: user.id,
          first_name: first_name,
          last_name: last_name,
          no_telepon: no_telepon,
          alamat: alamat,
          kota: kota,
          kode_pos: kode_pos,
          jenis_kelamin: jenis_kelamin,
          foto_profil: !picture ? "default.png" : picture,
        };

        const customer = await M_Customers.create(customerData)

        res.status(201).json({
          message: "Success When Insert Data!",
          data: { user, customer },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
        });
    }
})

const getCustomerById = asyncHandler(async (req, res) => {
    try {
        const { uuid } = req.params;

        let customerDetail = await User_Ecommerces.findOne({
          where: {
            uuid: uuid,
          },
          include: [
            {
              model: M_Customers,
              as: "M_Customers",
              required: true
            },
          ],
        });

        if (!customerDetail) {
          res.status(500).json({
            message: "Data Tidak Ditemukan!",
          });
        }

        res.status(200).json({
          data: customerDetail,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
        });
    }
})

const updateCustomer = asyncHandler( async (req, res) => {
    try {
        const { uuid } = req.params;
        const {
          username,
          email,
          password,
          picture,
          first_name,
          last_name,
          no_telepon,
          alamat,
          kota,
          kode_pos,
        } = req.body;

        const account = {
          uuid: uuidv4(),
          role_id: 3,
          username: username,
          email: email,
          password: password,
          picture: !picture ? "default.png" : picture,
        };

        const customerData = {
          first_name: first_name,
          last_name: last_name,
          no_telepon: no_telepon,
          alamat: alamat,
          kota: kota,
          kode_pos: kode_pos,
        };

        await User_Ecommerces.findOne({ uuid: uuid })
          .then((user) => {
            return user.update(account);
          })
          .then((updateUser) => {
            return M_Customers.findOne({
              where: { user_ecommerce_id: updateUser.id },
            });
          })
          .then((customer) => {
            if (customer) {
              return customer.update(customerData);
            }
            console.log("Tidak ada entri customer yang sesuai untuk diperbarui");
          })
          .catch((error) => {
            console.error("Error updating data:", error);
          });


        res.status(200).json({
          message: "Data Berhasil Diupdate!",
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
        });
    }
})

const deleteCustomer = asyncHandler(async (req, res) => {
  try {
    const { uuid } = req.params;

    let user = await User_Ecommerces.findOne({ uuid: uuid });

    if (!user) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    const customer = await M_Customers.findOne({
      where: { user_ecommerce_id: user.id },
    });
    if (customer) {
      await customer.destroy();
    }
    await user.destroy();

    res.status(200).json({
      message: "Data Berhasil Dihapus!",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
    getAllCustomer,
    createCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomer
}