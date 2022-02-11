const { response } = require("express");
const { ObjectId } = require("mongoose").Types
const { Usuario, Categorie, Product } = require('../models/index')

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUser = async (term = '', res= response) => {
    const isMongoId = ObjectId.isValid( term ) // Si es Id de mongo es true si no false

    if(isMongoId){
        const user = await Usuario.findById(term)
        res.json({
            results: ( user ) ? [ user ] : []
        });
    }

    const regex = new RegExp(term, 'i')

    const users = await Usuario.find({ 
        $or: [{nombre: regex}, {correo: regex }],
        $and: [{ status: true }]
    });

    res.json({
        results: users 
    });
};

const searchCategorie = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid( term )

    if(isMongoId) {
        const categorie = await Categorie.findById(term)
        res.json({
            results: (categorie) ? [ categorie] : []
        });
    }

    const regex = new RegExp(term, 'i');

    try {
        const categories = await Categorie.find({nombre:regex, status: true})
        res.json({
            results: categories
        });
    } catch (error) {
        throw error
    }
}

const searchProduct = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid( term )
    
    if(isMongoId) {
        const product = await Product.findById(term).populate('categorie','nombre')
        res.json({
            results: ( product ) ? [ product ] : []
        });
    }

    const regex = new RegExp(term, 'i')

    const products = await Product.find({ nombre:regex, status: true }).populate('categorie','nombre')

    res.json({
        results: products
    });
}

const search = async (req, res=response) => {

    const { collection, term } = req.params
    if(!allowedCollections.includes(collection)){
        return res.status(400).json({
            msg:`las colecciones permitidas son ${allowedCollections}`
        })
    }

    switch (collection) {
        case 'users':
            searchUser(term, res);
        break;
        case 'categories':
            searchCategorie(term, res)
        break;
        case 'products':
            searchProduct(term, res)
        break;

        default:
            res.status(500).json({
                msg:"Se le olvido hacer esta busqueda"
            })
        
    }
}

module.exports = {
    search
}