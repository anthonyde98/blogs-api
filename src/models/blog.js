const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    imagen: {
        type: String,
        required: [true, 'Por favor, coloque una imagen'],
    },
    creador: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Por favor, coloque un usuario'],
        trim: true,
        ref: 'User',
    },
    categoria: {
        type: String,
        enum: ['Deportes', 'Videojuegos', 'Tecnología', 'Cotidiano', "Naturaleza", "Cocina"],
        default: "Cotidiano"
    },
    desarrollo: {
        type: String,
        required: [true, 'Por favor, coloque el desarrollo del post'],
        trim: true
    },
    titulo: {
        type: String,
        required: [true, 'Por favor, coloque el titulo del post'],
        trim: true
    }
}, { timestamps: true});

module.exports = mongoose.model('Blog', blogSchema);