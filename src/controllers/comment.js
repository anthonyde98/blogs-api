const commentSchema = require("../models/comment");
const blogShared = require("../sharedMethods/blog");
const userShared = require("../sharedMethods/user");

const crearComentario = async (req, res) => {
    const commentElements = Object.keys(req.body);
    const allowedElements = ['blog', 'comentario'];
    const isValidOperation = () => {
        let response = true;
        for(let i = 0; i < allowedElements.length; i++) {
            if(!commentElements.includes(allowedElements[i])){
                response = false;
            }
        }

        return response;
    }

    if(!isValidOperation()) {
        return res.status(400).json({ message: 'Elementos incorrectos.' });
    }

    const creador = await userShared.existeUsuario(req.user.userId);

    if(!creador){
        return res.status(400).json({ message: 'Ese usuario no existe.' });
    }

    const blog = await blogShared.existeBlog(req.body.blog);

    if(!blog){
        return res.status(400).json({ message: 'Ese blog no existe.' });
    }

    try{
        const commentData = req.body;
        commentData.creador = req.user.userId;
        const comment = commentSchema(commentData);

        const response = await comment.save();
        return res.status(201).json(response);
    }
    catch(error){
        console.log(error)
        return res.status(500).json(error);
    }
}

const buscarComentario = async (req, res) => {
    const { id } = req.params;

    try{
        const comment = await commentSchema.findById(id);

        if(!comment){
            return res.status(404).json();
        }

        return res.status(200).json(comment);
    }
    catch(error){
        return res.status(500).json(error);
    }
}
 
const editarComentario = async (req, res) => {
    const { id } = req.params;
    const comment = req.body;

    try{
        const match = await commentSchema.findOne({ _id: id, creador: req.user.userId });

        if(!match){
            return res.status(403).json({ message: "Este usuario no tiene el permiso para editar este comentario." });
        }

        const response = await commentSchema.findByIdAndUpdate(id, comment, { new: true, runValidators: true });

        if(!response){
            return res.status(404).json();
        }

        return res.status(200).json(response);
    }
    catch(error){
        return res.status(500).json(error);
    }
}

const eliminarComentario = async (req, res) => {
    const { id } = req.params;

    try{
        const match = await commentSchema.findOne({ _id: id, creador: req.user.userId });

        if(!match){
            return res.status(403).json({ message: "Este usuario no tiene el permiso para eliminar este comentario." });
        }

        const response = await commentSchema.findByIdAndDelete(id);

        if(!response){
            return res.status(404).json();
        }
        
        return res.status(200).json();
    }
    catch(error){
        return res.status(500).json(error);
    }
}

const buscarComentariosPorBlog = async (req, res) => {
    const { id } = req.params;

    try {   
        const blog = await blogShared.existeBlog(id);

        if(!blog){
            return res.status(400).json({ message: 'Ese blog no existe.' });
        }
        
        const comments = await commentSchema.find({blog: id}).populate('creador', ['nombre', 'apellido', "correo"]);

        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    crearComentario,
    eliminarComentario,
    buscarComentariosPorBlog,
    buscarComentario,
    editarComentario
}