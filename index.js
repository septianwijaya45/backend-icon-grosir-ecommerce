const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_ACCESS_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cors());

const PORT = process.env.PORT || 3030;

global.__basedir = __dirname;

// *** ROUTES *** //
// deklarasi route
// Backoffice
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
const transactionOrder = require("./routes/backend/TransactionRoute");
const banner = require("./routes/backend/BannerRoute");
const setting = require("./routes/backend/SettingRoute");

// Ecomomerce
const resetUserEcommerce = require('./routes/frontend/Authentication/ResetRoute');
const categoryHome = require('./routes/frontend/Home/CategoryRoute');
const productHome = require('./routes/frontend/Home/ProductRoute');
const bannerFrontend = require("./routes/frontend/Home/BannerRoute");
const authUserEcommerce = require("./routes/frontend/Authentication/AuthRoute");
const wishlistTransaction = require("./routes/frontend/Transaction/WishlistRoute")
const cardTransaction = require("./routes/frontend/Transaction/CartRoute");
const checkoutTransaction = require("./routes/frontend/Transaction/CheckoutRoute");
const historyTransaction = require("./routes/frontend/Transaction/HistoryOrderRoute");

// User Route
const accountDetail = require('./routes/frontend/Authentication/UserRoute')

app.get('/', async (req, res) => {
  return res.send("API e-commerce IconGrosir")
})

// authentication
app.use("/api/auth", authUser);
app.use("/api/auth-ecommerce", authUserEcommerce);
app.use("/api/auth-ecommerce/reset", resetUserEcommerce);

// master backoffice
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
app.use("/api/transaction", transactionOrder);
app.use("/api/banner", banner);
app.use("/api/setting", setting);

// **** ecommerce **** //
app.use('/api/home/category', categoryHome);
app.use("/api/home/product", productHome);
app.use("/api/transaction/wishlist", wishlistTransaction);
app.use("/api/transaction/cart", cardTransaction);
app.use("/api/transaction/checkout", checkoutTransaction);
app.use("/api/transaction/history", historyTransaction);
app.use("/api/account-me", accountDetail);
app.use("/api/home/banner-app", bannerFrontend);

// *** ROUTES *** //

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
