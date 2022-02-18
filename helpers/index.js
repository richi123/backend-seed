


const dbValidators = require('./db-validators')
const genetareJWT = require('./generate-jwt')
const googleVerify = require('./google-verify')
const uploadFile = require('./upload-file')

module.exports = {
    ...dbValidators,
    ...genetareJWT,
    ...googleVerify,
    ...uploadFile,
}