const asyncHandler = require("express-async-handler");
const { M_Categories } = require("../../models/");

const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const category = await M_Categories.findAll();

    res.status(200).json({
      message: "Get Data Success!",
      data: category,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { category } = req.body;

    const newData = await M_Categories.create({
      category: category,
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

const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const category = await M_Categories.findOne({ where: { id: id } });

    if (!category) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    res.status(200).json({
      data: category,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    const checkCategory = await M_Categories.findOne({ where: { id: id } });

    if (!checkCategory) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Categories.update(
      {
        category: category,
      },
      {
        where: {
          id: id,
        },
      }
    );

    let newData = await M_Categories.findOne({ where: { id: id } });

    res.status(200).json({
      message: `Update Data ${checkCategory.category} Success!`,
      data: newData,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const checkCategory = await M_Categories.findOne({ where: { id: id } });

    if (!checkCategory) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await M_Categories.destroy({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: `Delete Data ${checkCategory.category} Success!`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  getAllCategory,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
