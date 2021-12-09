const router = require("express").Router();
const Subscription = require("../models/Subscription.model");

/* GET all Subscription */
router.get("/subscriptions", async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find().populate('products')
        return res.status(200).json(subscriptions);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in fetching products" });
    }
});

router.get("/subscriptions/:id", async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id).populate('products')
        return res.status(200).json(subscription);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in fetching product" });
    }
});

module.exports = router;