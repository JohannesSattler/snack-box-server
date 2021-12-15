const router = require("express").Router();
const authRoutes = require("./auth");
const productRoutes = require("./products");
const userRoutes = require("./user");
const subscriptionRoute = require('./subscriptions')
const paymentsRoutes = require('./payments')
const newsletterRoutes = require('./newsletter')

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);
router.use("/", subscriptionRoute);
router.use("/", productRoutes);
router.use("/", userRoutes);
router.use("/", paymentsRoutes);
router.use("/", newsletterRoutes);


module.exports = router;
