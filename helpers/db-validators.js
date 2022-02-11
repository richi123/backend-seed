const Role = require('../models/role')
const {Usuario, Categorie, Product} = require('../models')

const isValidRole = async (role = '') => {
    // error customizado
    const roleExist = await Role.findOne({ role })
    if( !roleExist ) {
        throw new Error(`El rol ${role} no esta registrado en la Base de datos.`)
    }
};

const emailExist = async (correo) => {
    const existEmail = await Usuario.findOne({ correo })
    if( existEmail ) {
        throw new Error(`El email ${correo} ya existe`)
    }
};

const userIdExist = async (id) => {
    try {
        const userExist = await Usuario.findById(id)
    } catch (error) {
        throw new Error(`El id ${id} no existe`)
    }
};

const existCategorieById = async (id) => {

    const categorieExist = await Categorie.findById(id)
    if(!categorieExist){
        throw new Error(`El id ${id} de la categoria no existe`)
    }
};

const existProductById = async (id) => {

    const productExist = await Product.findById(id)
    if(!productExist){
        throw new Error(`El id ${id} de el producto no existe`)
    }
};


module.exports = {
    isValidRole,
    emailExist,
    userIdExist,
    existCategorieById,
    existProductById
}