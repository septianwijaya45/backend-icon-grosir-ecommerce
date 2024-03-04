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
const authUser = require("./routes/AuthRoute");
const adminUser = require("./routes/UserAdminRoute");
const variant = require("./routes/VariantionRoute");
const category = require("./routes/CategoryRoute");
const size = require("./routes/SizeRoute");
const product = require("./routes/ProductRoute");
const expedition = require("./routes/ExpeditionRoute");
const discountCategory = require("./routes/DiscountCategoryRoute");
const discountProduct = require("./routes/DiscountProductRoute");

// authentication
app.use("/api/auth", authUser);

// master
app.use("/api/admin", adminUser);
app.use("/api/variant", variant);
app.use("/api/category", category);
app.use("/api/size", size);
app.use("/api/product", product);
app.use("/api/expedition", expedition);
app.use("/api/discount-categories", discountCategory);
app.use("/api/discount-products", discountProduct);
// *** ROUTES *** //

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
