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

module.exports = router;