const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");

router.post("/comment", async (req, res) => {
    return await commentController.crearComentario(req, res);
})

router.get("/comments/:id", async (req, res) => {
    return await commentController.buscarComentariosPorBlog(req, res);
})

router.get("/comment/:id", async (req, res) => {
    return await commentController.buscarComentario(req, res);
})

router.put("/comment/:id", async (req, res) => {
    return await commentController.editarComentario(req, res);
})

router.delete("/comment/:id", async (req, res) => {
    return await commentController.eliminarComentario(req, res);
})

module.exports = router;