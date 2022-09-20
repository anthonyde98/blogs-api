const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    blog: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Por favor, coloque un blog'],
        trim: true,
        ref: 'Blog',
    },
    creador: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Por favor, coloque un usuario'],
        trim: true,
        ref: 'User',
    },
    comentario: {
        type: String,
        required: [true, 'Por favor, coloque un comentario'],
        trim: true
    }
}, { timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);