const { response } = require("express");
const path = require('path')
const fs = require('fs')
const { uploadFile } = require("../helpers/upload-file");
const {Usuario, Product} = require('../models')
const cloudinary = require('cloudinary').v2

cloudinary.config( process.env.CLOUDINARY_URL )

const loadFile = async (req, res= response) => {

    // Imagenes
    try {
        // const name = await uploadFile(req.files, ['txt','md'], 'textos');
        const name = await uploadFile(req.files, undefined, 'imgs');
        
        res.json({ 
            name
        });
    } catch (error) {
        res.status(400).json({error}) 
    }
   
}

const updateUserImage = async (req, res = response) => {

    const { id, collection } = req.params

    let model;

    switch (collection) {
        case 'users':
            model = await Usuario.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

        break;

        case 'products':
            model = await Product.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

        break;
        
        default:
            return res.status(500).json({msg:"Se me olvido validar esto"})
    }

    // Limpiar imagenes previas
    if(model.img) {
        // Hay que borrar la imagen del servidor
        const imgPath = path.join( __dirname, '../uploads', collection, model.img)
        if(fs.existsSync(imgPath)){
            fs.unlinkSync(imgPath)
        }
    }

    const name = await uploadFile(req.files, undefined, collection);
    model.img = name

    try {
        await model.save()
        res.json(model)
    } catch (error) {
        throw error
    }
}

const updateUserImageCloudinary = async (req, res = response) => {

    const { id, collection } = req.params

    let model;

    switch (collection) {
        case 'users':
            model = await Usuario.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

        break;

        case 'products':
            model = await Product.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

        break;
        
        default:
            return res.status(500).json({msg:"Se me olvido validar esto"})
    }

    // Limpiar imagenes previas
    if(model.img) {
        // TODO
        const nameArr = model.img.split('/')
        const name = nameArr[nameArr.length - 1]
        const [ public_id ] = name.split('.')
        cloudinary.uploader.destroy(public_id)
        
    }

    const { tempFilePath } = req.files.file

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    model.img = secure_url

    try {
        await model.save()
        res.json(model)
    } catch (error) {
        throw error
    }
}

const showImage = async (req, res = response) => {
    const { id, collection } = req.params

    let model;

    switch (collection) {
        case 'users':
            model = await Usuario.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

        break;

        case 'products':
            model = await Product.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

        break;
        
        default:
            return res.status(500).json({msg:"Se me olvido validar esto"})
    }

    // Limpiar imagenes previas
    if(model.img) {
        // Hay que borrar la imagen del servidor
        const imgPath = path.join( __dirname, '../uploads', collection, model.img)
        if(fs.existsSync(imgPath)){
           return res.sendFile(imgPath)
        }
    }

    const noImgPath = path.join(__dirname, '../assets' + '/no-image.jpg')
    return res.sendFile(noImgPath)
}

module.exports = {
    loadFile,
    updateUserImage,
    showImage,
    updateUserImageCloudinary
}