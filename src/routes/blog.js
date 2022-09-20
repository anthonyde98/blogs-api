const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog")

router.get("/blog", async (req, res) => {
    return await blogController.buscarBlog(req, res);
})

router.get("/blog/:id", async (req, res) => {
    return await blogController.buscarBlogPorId(req, res);
})

router.post("/blog", async (req, res) => {
    return await blogController.crearBlog(req, res);
})

router.put("/blog/:id", async (req, res) => {
    return await blogController.editarBlog(req, res);
})

router.delete("/blog/:id", async (req, res) => {
    return await blogController.eliminarBlog(req, res);
})

router.get("/user/blog", async (req, res) => {
    return await blogController.buscarBlogPorUsuario(req, res);
})

router.get("/last/blog", async (req, res) => {
    return await blogController.buscarUltimoBlog(req, res);
})

module.exports = router;