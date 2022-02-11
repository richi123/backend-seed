const {Schema, model} = require('mongoose')

const ProductSchema = Schema({
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
    },
    price: {
        type: Number,
        default: 0
    },
    categorie: {
        type: Schema.Types.ObjectId,
        ref: "Categorie",
        require: true
    },
    description: { type: String },
    available: { type: Boolean, default: true },
});

ProductSchema.methods.toJSON = function() {
    const {__v, status, ...data } = this.toObject();
    return data;
}

module.exports = model('Product', ProductSchema)