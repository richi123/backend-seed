const { response, request } = require('express')
const Usuario = require('../models/user')
const jwt = require('jsonwebtoken')

const validateJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token')
    if(!token) {
        return res.status(401).json({
            msg:"No hay token en la peticion"
        })
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRET_PUBLIC_KEY);
        
        // leer el usuario que corresponde al uid
        const user = await Usuario.findById(uid)

        if(!user) {
            return res.status(401).json({
                msg:"Token no valido - Usuario no existe en BD"
            })
        }

        // consultar si usuario fue borrado
        if(!user.status) {
            console.log("ENTRE ACA EN EL USUARIO INACTIVO")
            return res.status(401).json({
                msg:"Token no valido - Usuario con estado inactivo"
            })
        }
        
        req.user = user

        next();    

    } catch (error) {

        console.log(error)
        res.status(401).json({
            msg:"Token no valido"
        })
    }
}


module.exports = {
    validateJWT
}