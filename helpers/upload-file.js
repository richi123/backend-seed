const path = require('path')
const { v4: uuidv4 } = require('uuid');


const uploadFile = (files, validExtensions = ['png', 'jpg', 'jpeg','gif'], folder = '') => {
    
    return new Promise( (resolve, reject) => {

        const { file } = files;

        const shortcutName = file.name.split('.')

        const extension = shortcutName[ shortcutName.length - 1]

        // Validar extension
        if( !validExtensions.includes( extension )){
            return reject(`La extension ${extension} no es permitida - ${validExtensions}`)
        }

        const tempFileName = uuidv4() + '.' + extension

        const uploadPath = path.join( __dirname, '../uploads/', folder ,tempFileName )

        file.mv(uploadPath, function(err) {
            if (err) {
            return reject(err)
            }

            resolve(tempFileName)
        });
    })
}

module.exports = {
    uploadFile
}