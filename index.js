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
const authUser = require("./routes/backend/AuthRoute");
const adminUser = require("./routes/backend/UserAdminRoute");
const variant = require("./routes/backend/VariantionRoute");
const category = require("./routes/backend/CategoryRoute");
const size = require("./routes/backend/SizeRoute");
const product = require("./routes/backend/ProductRoute");
const expedition = require("./routes/backend/ExpeditionRoute");
const discountCategory = require("./routes/backend/DiscountCategoryRoute");
const discountProduct = require("./routes/backend/DiscountProductRoute");
const customerAccount = require("./routes/backend/CustomerUserRoute");
const rateReviews = require("./routes/backend/RateReviewRoute");

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
app.use("/api/customer-account", customerAccount);
app.use("/api/rate-review", rateReviews);
// *** ROUTES *** //

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
