const { response } = require("express");
const { Categorie } = require('../models')

// getCategories - Paginado - total - populate
const getCategories = async (req, res = response) => {

    const { limit = 20, desde = 0} = req.query
    const query = { status:true }
    try {
        const [total, categories] = await Promise.all([
            Categorie.countDocuments(query),
            Categorie.find(query)
                .limit(limit)
                .populate('user', 'nombre')
                .skip(desde)
        ]);
    
        res.json({
            total,
            categories
        });
    } catch (error) {
        
        throw new Error('No se pudo obtener el listado de categorias', error)
    }
    
}
// getCategorieById - populate - trae objeto de categoria
const getCategorieById = async (req, res = response) => {

    const { id } = req.params
    const categorie = await Categorie.findById(id).populate('user','nombre')
    return categorie ? res.status(200).json({categorie}) : res.status(400).json({
        msg:`La categoria  con id ${id}no existe`
    })
}

const createCategorie = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categorieDB = await Categorie.findOne({nombre})

    if(categorieDB) {
        return res.status(400).json({
            msg:`La categoria ${categorieDB.nombre} ya existe`
        })
    }
    // Generar data a guardar
    const data = {
        nombre,
        user: req.user._id
    }

    const categorie = new Categorie(data)

    // Guardar DB
    await categorie.save()

    res.status(201).json(categorie);


}

// updateCategorie - no permitir actualizar a categoria existente
const updateCategorie = async (req, res = response) => {
    const id = req.params.id
    const { user, status, ...data } = req.body

    data.nombre = data.nombre.toUpperCase();
    data.user = req.user._id

    try {
        const categorie = await Categorie.findByIdAndUpdate(id, data, {new:true})

        res.json(categorie)
    } catch (error) {
        throw error
    }
}

// deleteCategorie - Borrado logico - status: false
const deleteCategorie = async (req, res = response) => {
    const id = req.params.id

    try {
        const categorie = await Categorie.findByIdAndUpdate(id, { status: false })

        res.json(categorie)
    } catch (error) {
        throw error
    }
    
}







module.exports = {
    createCategorie,
    getCategorieById,
    getCategories,
    updateCategorie,
    deleteCategorie
}