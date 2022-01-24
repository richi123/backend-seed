const { response } = require("express");
const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require("../helpers/google-verify");
const { usuariosDelete } = require("./user.controller");

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

const googleSignIn = async (req, res = response) => {

    const {id_token} = req.body

    try {

        const {nombre, img, correo, role= 'USER_ROLE'} = await googleVerify(id_token)

        let user = await User.findOne({ correo })

        if(!user){
            // tengo que crearlo
            const data = {
                nombre,
                correo,
                password:":P",
                img,
                role,
                google:true
            };

            user = new User( data )
            
            await user.save()
            
        }

        // Si el usuario en BD
        if(!user.status){
            return res.status(401).json({
                msg:"Hable con el administrador, usuario bloqueado"
            })
        }

        const token = await generateJWT(user.id)

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok:false,
            msg:"El token no se pudo verificar"
        })
    }

    

}

module.exports = {
    login,
    googleSignIn
}