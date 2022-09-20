const userSchema = require("../models/user");

const existeUsuario = async (id) => {
    const user = await userSchema.findById(id);

    if(user){
        return true;
    }

    return false;
}

const buscarUsuario = async (id) => {
    const user = await userSchema.findById(id);

    if(user){
        return user;
    }

    return false;
}

module.exports = {
    existeUsuario,
    buscarUsuario
}