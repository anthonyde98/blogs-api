const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/user", async (req, res) => {
    return await userController.buscarUsuario(req, res);
})

router.put("/user", async (req, res) => {
    return await userController.editarUsuario(req, res);
})

module.exports = router;