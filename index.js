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
// deklarasi route
const adminUser = require("./routes/UserAdminRoute");
const variant = require("./routes/VariantionRoute");
const category = require("./routes/CategoryRoute");
const size = require("./routes/SizeRoute");

// route
app.use("/api/admin", adminUser);
app.use("/api/variant", variant);
app.use("/api/category", category);
app.use("/api/size", size);
// *** ROUTES *** //

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
