const router = require("express").Router();
const authRoutes = require("./auth");
const productRoutes = require("./products");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);
router.use("/", productRoutes);

module.exports = router;
