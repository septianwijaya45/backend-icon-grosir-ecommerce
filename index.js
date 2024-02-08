const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3030;

global.__basedir = __dirname;

// *** ROUTES *** //
// *** ROUTES *** //

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
