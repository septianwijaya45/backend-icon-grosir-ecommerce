const asyncHandler = require("express-async-handler");
const { M_Ekspedisi } = require("../../../models/");

const getAllExpedition = asyncHandler(async (req, res) => {
  try {
    const expeditions = await M_Ekspedisi.findAll();

    res.status(200).json({
      message: "Get Data Success!",
      data: expeditions,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const createExpedition = asyncHandler(async (req, res) => {
  try {
    const { expedition } = req.body;

    const newData = await M_Ekspedisi.create({
      ekspedisi: expedition,
    });

    res.status(200).json({
      message: "Create Data Success!",
      data: newData,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const getExpeditionById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const expedition = await M_Ekspedisi.findOne({ where: { id: id } });

    if (!expedition) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    res.status(200).json({
      data: expedition,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const updateExpedition = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { expedition } = req.body;

    const checkExpedition = await M_Ekspedisi.findOne({ where: { id: id } });

    if (!checkExpedition) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Ekspedisi.update(
      {
        ekspedisi: expedition,
      },
      {
        where: {
          id: id,
        },
      }
    );

    let newData = await M_Ekspedisi.findOne({ where: { id: id } });

    res.status(200).json({
      message: `Update Data ${checkExpedition.ekspedisi} Success!`,
      data: newData,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const deleteExpedition = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const checkExpedition = await M_Ekspedisi.findOne({ where: { id: id } });

    if (!checkExpedition) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Ekspedisi.destroy({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: `Delete Data ${checkExpedition.ekspedisi} Success!`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  getAllExpedition,
  createExpedition,
  getExpeditionById,
  updateExpedition,
  deleteExpedition,
};
