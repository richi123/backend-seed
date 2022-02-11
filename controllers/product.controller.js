const { response } = require("express");
const { Product } = require('../models');

const createProduct = async (req, res = response) => {
    const nombre  = req.body.nombre.toUpperCase()

    const { status, user, ...body } = req.body
    // validar si producto existe
    const productDB = await Product.findOne({nombre})
   
    if(productDB) {
        return res.status(400).json({
            msg:`El producto ${nombre} ya existe`
        });
    }
    // generar data y crear instancia de schema de mongo con sus respectivos datos
    const data = {
        nombre,
        user: req.user._id,
        ...body
    }
    const product = new Product(data)
    // guardar data en mongo y enviar respuesta de servidor
    try {
        await product.save()
        res.status(201).json(product)
    } catch (error) {
        throw error
    }
    
};

const getProducts = async (req, res = response) => {
    // crear parametros de query y paginador
    const query = {status:true}
    const {limit = 10, desde = 0} = req.query
    // crear arreglo de promesas para traer la informacion y dar respuesta
    try {
        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .limit(limit)
                .populate('categorie', 'nombre')
                .populate('user', 'nombre')
                .skip(desde)
        ]);
        res.status(200).json({
            total,
            products
        })
    } catch (error) {
        throw error
    }
};

const getProductsById = async (req, res = response) => {
    const id = req.params.id
    try {
        const product = await Product.findById(id).populate('user', 'nombre').populate('categorie', 'nombre')
        return product ? res.status(200).json({product}) : res.status(400).json({
            msg:`El id ${id} del producto que usted esta buscando no existe`
        }); 
    } catch (error) {
        throw error
    }
    
};

const updateProduct = async (req, res = response) => {
    const id = req.params.id

    const {user, ...data} = req.body

    if (data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.user = req.user._id

    try {
        const product = await Product.findByIdAndUpdate(id, data, {new: true})
        res.status(200).json({
            product
        })
    } catch (error) {
        throw new Error(`No fue posible actualizar el usuario`, error)
    }
};

const deleteProduct = async (req, res = response) => {
    const id = req.params.id

    try {
        const product = await Product.findByIdAndUpdate(id, { status: false })

        res.json(product)
    } catch (error) {
        throw error
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProductsById,
    updateProduct,
    deleteProduct
}