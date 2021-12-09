const router = require("express").Router();
const Product = require("../models/Product.model");

/* GET all products */
router.get("/products", async (req, res, next) => {
    try {
        const products = await Product.find()
        return res.status(200).json(products);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in fetching products" });
    }
});

router.get("/products/:id", async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        return res.status(200).json(product);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in fetching product" });
    }
});

module.exports = router;