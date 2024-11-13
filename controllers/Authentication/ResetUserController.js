const asyncHandler = require("express-async-handler");
const { Op } = require('sequelize')
const {
  sequelize,
  User_Ecommerces
} = require("../../models/");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const SECRET_KEY_RESET_PASSWORD = '$2y$12$cbNLdDXnOWvfjcQ8mcoHw.ddAb1J.emLgn94.WTsVrPHwWaINNqL2';

const getUserByEmail = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        let checkUserEmail = await User_Ecommerces.findOne({
            where: {
              email: email
            }
        });

        if(!checkUserEmail){
            return res.status(200).json({
              message: "Email Anda Tidak Terdaftar!",
              status: false
            });
        }

        const token = jwt.sign(
            { email, timestamp: Date.now() },
            SECRET_KEY_RESET_PASSWORD,
            { expiresIn: '360s' }
        );

        return res.json({ 
            status: true,
            token: token
         });
    } catch (error) {
        return res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
        });
    }
})

const resetPassword = asyncHandler(async(req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const decoded = jwt.verify(token, SECRET_KEY_RESET_PASSWORD);
        const { email, timestamp } = decoded;

        const currentTime = Date.now();
        if (currentTime - timestamp > 360 * 1000) {
            return res.status(400).json({ 
                status: false,
                message: 'Token has expired' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        const user = await User_Ecommerces.update({
            password: newPassword
        },{ 
            where: {
                email: email 
            }
        });
        console.log('user yang diupdate')
        console.log(email)
        console.log(user)
        

        return res.status(200).json({
            status: true,
            message: "User Berhasil Reset Password!",
        });
    } catch (error) {
        return res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
        });
    }
})

module.exports = {
    getUserByEmail,
    resetPassword
}