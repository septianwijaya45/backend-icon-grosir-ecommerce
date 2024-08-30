const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const {
    SettingApp
} = require('../../../models');

const getSetting = asyncHandler(async (req, res) => {
    try {
        const setting = await SettingApp.findOne();
        console.log('ini setting')
        console.log(setting)

        res.status(200).json({
            message: "Get Data Success!",
            data: setting,
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({
          message: "Internal Server Error! Please Contact Developer",
          status: false,
        });
    }
});

const insertOrUpdate = asyncHandler(async (req, res) => {
    try {
        const { name_app, no_telp, logo } = req.body;

        let record = await SettingApp.findOne({ where: { no_telp } });

        if (record) {
            record.name_app = name_app;
            record.logo = logo;

            await record.save();
            res.status(200).json({
                message: 'Record updated successfully',
                status: true,
                data: record
            });
        } else {
            record = await SettingApp.create({
                name_app,
                no_telp,
                logo
            });
            res.status(201).json({
                message: 'Record created successfully',
                status: true,
                data: record
            });
        }
    } catch (error) {
        console.error("Error inserting or updating record:", error);
        res.status(500).json({
            message: 'Internal Server Error! Please contact the developer.',
            status: false,
        });
    }
});

module.exports = {
    getSetting,
    insertOrUpdate
}