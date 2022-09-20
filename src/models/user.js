const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor, coloque un nombre'],
        trim: true,
        minlength: 1
    },
    apellido: {
        type: String,
        required: [true, 'Por favor, coloque un apellido'],
        trim: true,
        minlength: 1
    },
    correo: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Por favor, coloque un correo valido',
        }
    },
    contrasena: {
        type: String,
        required: [true, 'Por favor, coloque una contraseña valida'],
        trim: true,
        minlength: 5,
        select: false
    }
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('contrasena')) return;
    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
});

userSchema.pre('findOneAndUpdate', async function() {
    if(!this._update.contrasena) return;
    const salt = await bcrypt.genSalt(10);
    this._update.contrasena = await bcrypt.hash(this._update.contrasena, salt);
});
  
userSchema.methods.createJWT = function() {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
};
  
userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.contrasena);
    return isMatch;
};

module.exports = mongoose.model('User', userSchema);