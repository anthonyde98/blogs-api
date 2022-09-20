const userSchema = require("../models/user");

const registro = async (req, res) => {
    const userElements = Object.keys(req.body);
    const allowedElements = ['nombre', 'apellido', 'correo', 'contrasena'];
    const isValidOperation = () => {
        let response = true;
        for(let i = 0; i < allowedElements.length; i++) {
            if(!userElements.includes(allowedElements[i])){
                response = false;
            }
        }

        return response;
    }

    if(!isValidOperation()) {
        return res.status(400).json({ message: 'Elementos incorrectos.' })
    }

    const { nombre, apellido, correo, contrasena } = req.body;

    if(nombre.length < 1 || apellido.length < 1  || correo.length < 1  || contrasena.length < 5 ) {
        return res.status(400).json({ message: 'Se deben colocar todos los valores correctamente.' });
    }

    try{
        const existeCorreo = await userSchema.findOne({ correo });

        if (existeCorreo) {
            return res.status(400).json({ message: 'Un usuario ya tiene este correo.' });
        }

        const user = await userSchema.create({ nombre, apellido, correo, contrasena });
    
        const token = user.createJWT();

        return res.status(201).json({
            correo: user.correo,
            token: token,
            nombre: user.nombre + " " + user.apellido
        });
    }
    catch(error){
        return res.status(500).json(error);
    }
}

const buscarUsuario = async (req, res) => {
    try{
        const blog = await userSchema.findById(req.user.userId);

        if(blog){
            return res.status(200).json(blog);
        }
            
        return res.status(404).json();
    }
    catch(error){
        return res.status(500).json(error);
    }
}

const editarUsuario = async (req, res) => {
    const { nombre, apellido, contrasena } = req.body;

    let userData = {};

    if(contrasena){
        if(contrasena.length > 4){
            userData.contrasena = contrasena;
        }
        else{
            return res.status(400).json();
        }
    }

    if(nombre.length > 0 && apellido.length > 0){
        userData.nombre = nombre;
        userData.apellido = apellido;
    }
    else{
        return res.status(400).json();
    }

    try{
        const response = await userSchema.findByIdAndUpdate(req.user.userId, userData, { new: true, runValidators: true });

        if(!response){
            return res.status(404).json();
        }

        return res.status(200).json(response);
    }
    catch(error){
        console.log(error)
        return res.status(400).json(error);
    }
} 

const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    if (correo.length < 1 || contrasena.length < 5 ) {
        return res.status(400).json({ message: 'Se deben colocar todos los valores correctamente.' });
    }

    try {
        const user = await userSchema.findOne({ correo }).select('+contrasena');

        if (!user) {
            return res.status(404).json();
        }

        const isPasswordCorrect = await user.comparePassword(contrasena);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Contraseña incorrecta.' });
        }

        const token = user.createJWT();

        return res.status(200).json({ correo, token, nombre: user.nombre + " " + user.apellido });

    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}

module.exports = {
    registro,
    login,
    buscarUsuario,
    editarUsuario
}