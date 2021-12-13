const router = require("express").Router();
const User = require("../models/User.model");

/* GET user by id */
router.get("/user/:id", async (req, res, next) => {
    try {
        const {id} = req.params
        const user = await User.findById(id, req.body)
        return res.status(201).json(user);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in updating user" });
    }
});

/* PATCH user by id */
router.patch("/user/:id/update", async (req, res, next) => {
    try {
        const {id} = req.params
        await User.findByIdAndUpdate(id, req.body)
        const user = await User.findById(id)
        return res.status(201).json(user);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in updating user" });
    }
});

/* Add or Remove Subscription */
router.patch("/user/:id/subscriptions/:subId/add", async (req, res, next) => {
    try {
        const {id, subId} = req.params
        await User.findByIdAndUpdate(id, {$push: {subscriptions: subId}})
        const user = await User.findById(id)
        return res.status(201).json(user);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in updating user" });
    }
});

router.patch("/user/:id/subscriptions/:subId/remove", async (req, res, next) => {
    try {
        const {id, subId} = req.params
        await User.findByIdAndUpdate(id, {$pull: {subscriptions: subId}})
        const user = await User.findById(id)
        return res.status(201).json(user);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in updating user" });
    }
});

router.get("/user/:id/subscriptions", async (req, res, next) => {
    try {
        const {id} = req.params
        const user = await User.findById(id).populate({
            path: 'subscriptions',
            populate: {
                path: 'products',
                model: 'products'
            }
        })

        
        let total = user.subscriptions.reduce((total, subscribtion) => {
            const productSum = subscribtion.products.reduce((t, p) => t + p.price, 0)
            subscribtion.total = Number(productSum.toFixed(2))
            return total + productSum
        }, 0) 
        total = Number(total.toFixed(2))
        

        const response = {
            total,
            subscriptions: user.subscriptions,
        }
        return res.status(201).json(response);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in updating user" + error });
    }
});

module.exports = router;