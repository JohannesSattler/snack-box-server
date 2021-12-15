const router = require("express").Router();
const Newsletter = require('../models/Newsletter.model')
const User = require("../models/User.model");
const Orders = require("../models/Order.model")
const Product = require("../models/Product.model");
const Subscription = require("../models/Subscription.model");

function adminMiddleWare(req, res, next) {
    const { superSecret } = req.body
    console.log(superSecret)
    if(!superSecret || superSecret !== process.env.REACT_APP_ADMIN_SECRET) {
        return res
            .status(400)
            .json({ errorMessage: "There was an error bro!" });
    }
}

router.post("/admin/login", (req, res, next) => {
    console.log(req.body)
    const { username, password } = req.body;

    if(!username || !password) {
        return res
            .status(400)
            .json({ errorMessage: "There was an error bro!" });
    }

    process.env.ADMIN_USER
    process.env.ADMIN_PASS

    if(username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) {
        return res
            .status(400)
            .json({ errorMessage: "There was an error bro!" });
    }

    if(username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        res.status(200).json({ message: "Admin is allowed!" });
    }
})

router.get("/admin/products", async(req, res, next) => {
    try {
        console.log("dassda")
        const product = await Product.find().limit(30)
        console.log(product)
        return res.status(200).json(product);
    }
    catch(error) {
        return res
            .status(400)
            .json({ errorMessage: "There was an error bro!" });
    }
})

router.get("/admin/orders", async(req, res, next) => {
    try {
        const orders = await Orders.find()
        res.status(200).json(orders);
    }
    catch(error) {
        return res
            .status(400)
            .json({ errorMessage: "There was an error bro!" });
    }
})

router.get("/admin/newsletter", async(req, res, next) => {
    try {
        const newsletter = await Newsletter.find()
        res.status(200).json(newsletter);
    }
    catch(error) {
        return res
            .status(400)
            .json({ errorMessage: "There was an error bro!" });
    }
})

router.get("/admin/users", async(req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json(users);
    }
    catch(error) {
        return res
            .status(400)
            .json({ errorMessage: "There was an error bro!" });
    }
})

router.post("/admin/product/create", async(req, res, next) => {
    try {
        console.log(req.body)
        const product = await Product.create(req.body)
        res.status(200).json(product);
    }
    catch(error) {
        console.log(error)
        return res
            .status(400)
            .json({ errorMessage: "There was an error bro!" });
    }
})

router.post("/admin/subscription/create", async(req, res, next) => {
    try {
        const subscription = await Subscription.create(req.body)
        res.status(200).json(subscription);
    }
    catch(error) {
        return res
            .status(400)
            .json({ errorMessage: "There was an error bro!" });
    }
})

module.exports = router;