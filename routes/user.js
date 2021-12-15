const router = require("express").Router();
const User = require("../models/User.model");
const Orders = require("../models/Order.model")

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

router.get("/user/:id/verify-email", async (req, res, next) => {
    try {
        const {id} = req.params
        await User.findByIdAndUpdate(id, {isVerified: true})
        const user = await User.findById(id)
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

router.get("/orders", async (req, res, next) => {
    try {
        const orders = await Orders.find()
        return res.status(201).json(orders);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in updating user" + error });
    }
});

router.get("/user/:id/orders", async (req, res, next) => {
    try {
        const {id} = req.params
        const orders = await User.findById(id).populate({
            path: 'orders',
            populate: {
                path: 'subscription',
                model: 'subscriptions'
            }
        })
        return res.status(201).json(orders);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in updating user" + error });
    }
});

router.patch("/user/:id/orders/add", async (req, res, next) => {
    try {
        console.log(req.body)
        const {id} = req.params
        const orderIds = []

        const orders = req.body

        for(let i = 0; i < orders.length; i++) {
            const order = await Orders.create(orders[i])
            const orderid = order.id
            console.log({orderid})
            orderIds.push(orderid)
        }

        console.log(orderIds)
        await User.findByIdAndUpdate(id, {$push: {orders: {$each: orderIds}}})
        const user = await User.findById(id)
        console.log(user)
        return res.status(201).json(user);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in updating user" });
    }
});

router.delete("/user/:id/delete", async (req, res, next) => {
    try {
        const {id} = req.params
        const deletedUser = await User.findByIdAndDelete(id)
        return res.status(201).json(deletedUser);
    } 
    catch (error) {
        return res.status(404).json({ error: "Error in updating user" + error });
    }
});

module.exports = router;