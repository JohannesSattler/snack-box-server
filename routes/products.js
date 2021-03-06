const router = require("express").Router();
const Product = require("../models/Product.model");

/* GET all products */
router.post("/products", async (req, res, next) => {
    try {
        const {page} = req.body
        console.log(req.body)
        let itemCount = 0
        if(page === 0) {
            itemCount = Math.ceil((await Product.find()).length / 12)
        }

        const products = await Product.find().skip(12 * page).limit( 12 )
        return res.status(200).json({products, itemCount});
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