const {Schema, model} = require('mongoose')

const CategorieSchema = Schema({
    nombre:{
        type:String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status:{
        type: Boolean,
        default: true,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        require: true
    }
});

CategorieSchema.methods.toJSON = function() {
    const {__v, status, ...data } = this.toObject();
    return data;
}

module.exports = model('Categorie', CategorieSchema)