const asyncHandler = require("express-async-handler");
const { User_Ecommerces, user_confirm_otp } = require("../../models/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const moment = require('moment');
const { Op } = require('sequelize')

const registerUser = asyncHandler(async (req, res) => {
    try {
        const {
            name,
            email,
            no_telepon,
            password
        } = req.body;

        const formattedNoTelepon = no_telepon.startsWith('0') ? '62' + no_telepon.slice(1) : no_telepon;

        let checkUserEmail = await User_Ecommerces.findOne({
          where: {
            email: email
          }
        })

        if(checkUserEmail){
          res.status(200).json({
            message: "Anda sudah terdaftar!",
            status: false
          });
        }

        let checkUserTelepon = await User_Ecommerces.findOne({
          where: {
            no_telepon: formattedNoTelepon
          }
        })

        if(checkUserTelepon){
          res.status(200).json({
            message: "Anda sudah terdaftar!",
            status: false
          });
        }
    
        const createUser = {
            uuid: uuidv4(),
            name: name,
            email: email,
            is_verify: 0,
            password: password,
            no_telepon: formattedNoTelepon
        }
    
        const user = await User_Ecommerces.create(createUser);
    
        const createOtp = Math.floor(100000 + Math.random() * 900000).toString();

        const insertDataOtp = await user_confirm_otp.create({
            user_ecommerce_id: user.id,
            kode_otp: createOtp,
            expired_date: moment().add(5, 'minutes').toDate() 
        });
    
        /*
        const response = await fetch(process.env.URL_API_WA_WEB+'send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number: formattedNoTelepon, otp: createOtp })
        });
        */
        
        // const result = await response.json();
        
        res.status(200).json({
            message: "Data Success Registered!",
            status: true,
            user:user,
            otp: createOtp
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: false,
            message: "Internal Server Error! Please Contact Developer",
        });
    }
});

const getConfirmOtp = asyncHandler(async (req, res) => {
  try {
    const { user_id } = req.body;

    const user = await User_Ecommerces.findOne({
      where: { uuid: user_id }
    })

    const otpData = await user_confirm_otp.findOne({
        where: {
            user_ecommerce_id: user.id,
            kode_otp_confirm: null,
            expired_date: {
              [Op.gt]: new Date()
            }
        },
        attributes: ['kode_otp', 'expired_date']
    });

    if (!otpData) {
        return res.status(400).json({
            status: false,
            message: "OTP tidak ditemukan atau tidak valid!"
        });
    }

    res.status(200).json({
        status: true,
        message: "Get Confirm OTP berhasil!",
        otp: otpData,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error! Please Contact Developer",
    });
  }
})

const confirmOtp = asyncHandler(async (req, res) => {
  try {
      const { user_id, kode_otp } = req.body;

      const kodeOtpInt = parseInt(kode_otp, 10);

      const user = await User_Ecommerces.findOne({
        where: { uuid: user_id }
      })

      const otpData = await user_confirm_otp.findOne({
          where: {
              user_ecommerce_id: user.id,
              kode_otp: kodeOtpInt
          }
      });
      
      if (!otpData) {
          return res.status(400).json({
              status: false,
              message: "OTP tidak ditemukan atau tidak valid!"
          });
      }

      if (moment().isAfter(otpData.expired_date)) {
          return res.status(400).json({
              status: false,
              message: "OTP sudah kedaluwarsa!"
          });
      }

      await User_Ecommerces.update({ is_verify: 1 }, {
          where: {
              uuid: user_id
          }
      });

      await user_confirm_otp.destroy({
          where: {
              id: otpData.id
          }
      });

      const accessToken = jwt.sign({ username: user.no_telepon }, "accesssecret", {
        expiresIn: "15h",
      });
      const refreshToken = jwt.sign(
        { username: user.no_telepon },
        "refreshsecret",
        { expiresIn: "7d" }
      );
  
      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshToken;
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
          status: true,
          message: "Verifikasi OTP berhasil!",
          accessToken: accessToken,
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({
          status: false,
          message: "Internal Server Error! Please Contact Developer",
      });
  }
});

const resendOtp = asyncHandler(async (req, res) => {
  try {
    const { user_id } = req.body;

    const user = await User_Ecommerces.findOne({
      where: { uuid: user_id }
    })

    await user_confirm_otp.destroy({
        where: {
            user_ecommerce_id: user.id
        }
    });
    const formattedNoTelepon = user.no_telepon.startsWith('0') ? '62' + user.no_telepon.slice(1) : user.no_telepon;
    

    const createOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const insertDataOtp = await user_confirm_otp.create({
        user_ecommerce_id: user.id,
        kode_otp: createOtp,
        expired_date: moment().add(5, 'minutes').toDate() 
    });

    /*
    const response = await fetch(process.env.URL_API_WA_WEB+'send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number: formattedNoTelepon, otp: createOtp })
    });
    */

    res.status(200).json({
        status: true,
        message: "Resend OTP Berhasil!"
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
        status: false,
        message: "Internal Server Error! Please Contact Developer",
    });
}
})

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    let user, formattedNoTelepon;

    const isEmail = /\S+@\S+\.\S+/;
    let checkIfEmail = isEmail.test(username);

    if(checkIfEmail){
      user = await User_Ecommerces.findOne({ where: { email: username } });
    }else{
      formattedNoTelepon = username.startsWith('0') ? '62' + username.slice(1) : username;
      user = await User_Ecommerces.findOne({ where: { no_telepon: formattedNoTelepon } })
    }

    if (!user) {
      return res.status(200).json({
        status: false,
        statusCode: 422,
        message: "User tidak ditemukan!",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(200).json({
        status: false,
        message: "Username atau password tidak valid!",
      });
    }

    const createOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const insertDataOtp = await user_confirm_otp.create({
        user_ecommerce_id: user.id,
        kode_otp: createOtp,
        expired_date: moment().add(5, 'minutes').toDate() 
    })

    /*
    const response = await fetch(process.env.URL_API_WA_WEB+'send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number: formattedNoTelepon, otp: createOtp })
    });
    */

    res.status(200).json({
      status: true,
      message: "Berhasil Login!",
      user: user
    });
  } catch (error) {
    console.error(error); // Menampilkan kesalahan di konsol server
    res.status(500).json({
      status: false,
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("Refresh token not found");

    jwt.verify(refreshToken, "refreshsecret", (err, user) => {
      if (err) throw new Error("Invalid refresh token");
      const accessToken = jwt.sign(
        { username: user.no_telepon },
        "accesssecret",
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logout,
  confirmOtp,
  resendOtp,
  getConfirmOtp
};
