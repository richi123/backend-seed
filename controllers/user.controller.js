const { response } = require('express')

const usuariosGet = (req= request, res = response) => {

    const {q, nombre ='no name', apikey} = req.query
    
    res.json({
        msg:"GET API - Controlador",
        q,nombre,apikey
    });
};

const usuariosPost = (req, res = response) => {
    
    const {nombre, edad} = req.body;

    res.json({
        msg:"POST API - Controlador",
        nombre,
        edad
    });
};

const usuariosPut = (req, res = response) => {
    const id = req.params.id

    res.json({
        msg:"PUT API - Controlador",
        id
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg:"PATCH API - Controlador"
    });
};

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: "DELETE API - Controlador"
    });
};


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}