const { response } = require("express");
const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const { generateJWT } = require('../helpers/generate-jwt')

const login = async (req,res = response) => {

    const { correo, password } = req.body

    try {
        // Verificar si el email existe
        const user = await User.findOne({correo});
        if(!user){
            return res.status(400).json({
                msg:"Usuario / Password no son correctos - correo"
            });
        }
        // Verificar si user esta acivo
        if(!user.status){
            return res.status(400).json({
                msg:"Usuario / Password no son correctos - estado: false"
            });
        }
        // Verificar contraseña
        const validPassword = bcryptjs.compareSync( password, user.password)
        if(!validPassword){
            return res.status(400).json({
                msg:"Usuario / Password no son correctos - password"
            })
        }
        // Generar el JWT
        const token = await generateJWT(user.id)
        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"algo salio mal"
        })
    }
}

module.exports = {
    login
}