const blogSchema = require("../models/blog");
const userShared = require("../sharedMethods/user");

const crearBlog = async (req, res) => {
    const blogElements = Object.keys(req.body);
    const allowedElements = ['imagen', 'categoria', 'desarrollo', 'titulo'];
    const isValidOperation = () => {
        let response = true;
        for(let i = 0; i < allowedElements.length; i++) {
            if(!blogElements.includes(allowedElements[i])){
                response = false;
            }
        }

        return response;
    }

    if(!isValidOperation()) {
        return res.status(400).json({ message: 'Elementos incorrectos.' })
    }

    const creador = await userShared.existeUsuario(req.user.userId);
    
    if(!creador){
        return res.status(400).json({ message: 'Ese usuario no existe.' })
    }

    try{
        const blogData = req.body;
        blogData.creador = req.user.userId;
        const blog = blogSchema(blogData);

        const response = await blog.save();
        return res.status(201).json(response);
    }
    catch(error){
        console.log(error)
        return res.status(500).json(error);
    }
}

const buscarBlog = async (req, res) => {
    const {categoria, titulo} = req.query;
    const query = {};

    if(titulo && titulo.length > 0){
        query.titulo = { $regex: titulo, $options: 'i' };
    }

    if(categoria && categoria.length > 0){
        query.categoria = categoria;
    }

    try{
        const blogs = await blogSchema.find(query).populate('creador', ['nombre', 'apellido']);
        
        return res.status(200).json(blogs);
    }
    catch(error){
        return res.status(500).json(error);
    }
}

const buscarBlogPorId = async (req, res) => {
    const { id } = req.params;

    try{
        const blog = await blogSchema.findById(id).populate('creador', ['nombre', 'apellido', "correo"]);

        if(blog){
            return res.status(200).json(blog);
        }
            
        return res.status(404).json();
    }
    catch(error){
        return res.status(500).json(error);
    }
}

const editarBlog = async (req, res) => {
    const { id } = req.params;
    const blog = req.body;

    try{
        const match = await blogSchema.findOne({ _id: id, creador: req.user.userId });

        if(!match){
            return res.status(403).json({ message: "Este usuario no tiene el permiso para editar este post." });
        }

        const response = await blogSchema.findByIdAndUpdate(id, blog, { new: true, runValidators: true });

        if(!response){
            return res.status(404).json();
        }

        return res.status(200).json(response);
    }
    catch(error){
        return res.status(400).json(error);
    }
}

const eliminarBlog = async (req, res) => {
    const { id } = req.params;

    try{
        const match = await blogSchema.findOne({ _id: id, creador: req.user.userId });

        if(!match){
            return res.status(403).json({ message: "Este usuario no tiene el permiso para eliminar este post." });
        }

        const response = await blogSchema.findByIdAndDelete(id);

        if(!response){
            return res.status(404).json();
        }

        return res.status(200).json();
    }
    catch(error){
        return res.status(500).json(error);
    }
}

const buscarBlogPorUsuario = async (req, res) => {
    const {categoria, titulo} = req.query;
    const query = {};

    if(titulo && titulo.length > 0){
        query.titulo = { $regex: titulo, $options: 'i' };
    }

    if(categoria && categoria.length > 0){
        query.categoria = categoria;
    }

    const creador = await userShared.existeUsuario(req.user.userId);

    if(!creador){
        return res.status(400).json({ message: 'Ese usuario no existe.' })
    }

    query.creador = req.user.userId;

    try{
        const blogs = await blogSchema.find(query).populate('creador', ['nombre', 'apellido']);
        
        return res.status(200).json(blogs);
    }
    catch(error){
        return res.status(500).json(error);
    }
}

const buscarUltimoBlog = async (req, res) => {
    try{
        const blogs = await blogSchema.find().populate('creador', ['nombre', 'apellido']).sort({createdAt:-1}).limit(1);
        
        return res.status(200).json(blogs);
    }
    catch(error){
        console.log(error)
        return res.status(500).json(error);
    }
}

module.exports = {
    crearBlog,
    buscarBlog,
    buscarBlogPorId,
    editarBlog,
    eliminarBlog,
    buscarBlogPorUsuario,
    buscarUltimoBlog
}