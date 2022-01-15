

const { Schema, model } = require('mongoose')

const userSchema = Schema ({
    nombre: {
        type: String,
        required:[true, 'Nombre es requerido'],
    },
    correo: {
        type: String,
        required:[true, 'El correo es requerido'],
        unique: true
    },
    password: {
        type: String,
        required:[true, 'La contraseña es obligatoria'],
    },
    imagen: {
        type: String,
    },
    role: {
        type: String,
        required:true,
        enum:['ADMIN_ROLE', 'USER_ROLE','SALES_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id
    return user;
}

module.exports = model('Usuario', userSchema);