const { response, request } = require('express')
const Usuario = require("../models/user")
const bcryptjs = require('bcryptjs');


const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { status:true}
    // const users = await Usuario.find(query)
    //     .limit(Number(limite))
    //     .skip(Number(desde))

    // const total = await Usuario.countDocuments(query)
    // con promesa es mejor en vez de manejar multiples await
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
    ]);
    
    res.json({
    total,
    usuarios
    });
};

const usuariosPost = async (req, res = response) => {
    // Destructuracion de peticion
    const {nombre, correo, password, role} = req.body;
    const usuario = new Usuario({nombre, correo, password, role}) 

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt)
    //Guardar en DB
    await usuario.save()
    // Respuesta servidor
    res.json({
        usuario
    });
};

const usuariosPut = async (req, res = response) => {
    const id = req.params.id
    const { _id ,password, google,correo, ...resto } = req.body

    //TODO validar contra BD
    if(password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const userDB = await Usuario.findByIdAndUpdate(id, resto)

    res.json(userDB);
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg:"PATCH API - Controlador"
    });
};

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    //const uid = req.uid
    // Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id)
    
    // Borrado logico
    const usuario = await Usuario.findByIdAndUpdate(id,{status:false});
    //const usuarioAutenticado = req.user

    res.json(usuario);
};


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}