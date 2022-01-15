const { response } = require("express")


const isAdminRole = (req = require, res = response, next) => {

    if(!req.user){
        res.status(500).json({
            msg:"Se requiere verificar el rol sin validar el token primero"
        })
    }

    const { role, nombre } = req.user

    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg:` ${nombre} no es un administrador - no puede hacer esto`
        })
    }

    next()
}

// el ... sirve para concatenar argumentos en un arreglo, cuando se usa como argumento de funcion
const haveARole = (...roles ) => {
    return (req, res = response, next ) => {
        if(!req.user){
            res.status(500).json({
                msg:"Se requiere verificar el rol sin validar el token primero"
            })
        }

        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles ${roles}`
            })
        }
        
        next()
    }
}




module.exports = {
    isAdminRole,
    haveARole
}