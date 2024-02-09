const asyncHandler = require("express-async-handler");
const { M_Sizes } = require("../../models/");

const getAllSize = asyncHandler(async (req, res) => {
  try {
    const sizes = await M_Sizes.findAll();

    res.status(200).json({
      message: "Get Data Success!",
      data: sizes,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const createSize = asyncHandler(async (req, res) => {
  try {
    const { size } = req.body;

    const newData = await M_Sizes.create({
      size: size,
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

const getSizeById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const size = await M_Sizes.findOne({ where: { id: id } });

    if (!size) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    res.status(200).json({
      data: size,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const updateSize = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { size } = req.body;

    const checkSize = await M_Sizes.findOne({ where: { id: id } });

    if (!checkSize) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Sizes.update(
      {
        size: size,
      },
      {
        where: {
          id: id,
        },
      }
    );

    let newData = await M_Sizes.findOne({ where: { id: id } });

    res.status(200).json({
      message: `Update Data ${checkSize.size} Success!`,
      data: newData,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const deleteSize = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const checkSize = await M_Sizes.findOne({ where: { id: id } });

    if (!checkSize) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Sizes.destroy({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: `Delete Data ${checkSize.size} Success!`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  getAllSize,
  createSize,
  getSizeById,
  updateSize,
  deleteSize,
};
