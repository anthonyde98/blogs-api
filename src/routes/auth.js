const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/login", async (req, res) => {
    return await userController.login(req, res);
})

router.post("/register", async (req, res) => {
    return await userController.registro(req, res);
})

module.exports = router;