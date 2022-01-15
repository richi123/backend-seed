const jwt = require("jsonwebtoken")

const generateJWT = ( uid = '' ) => {
    // Al ser promesa, el return promise me permite ejecutarla con await en otros arvhicos
    return new Promise((resolve, reject) => {

        const payload = { uid }

        jwt.sign( payload, process.env.SECRET_PUBLIC_KEY, {
            expiresIn:'4h'
        }, (err,token) => {
            if(err){
                console.log(err)
                reject('No se pudo generar el token')
            } else {
                resolve( token );
            }
        });

    })
};

module.exports = {
    generateJWT
}