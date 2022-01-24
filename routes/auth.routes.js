const { check } = require('express-validator')
const {Router} = require('express');
const { login, googleSignIn } = require('../controllers/auth.controller');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router()

router.post('/login', [
    check('correo', 'El correo debe ser obligatorio').isEmail(),
    check('password', 'La contraseña debe ser obligatoria').not().isEmpty(),
    validateFields
],login);


router.post('/google', [
    check('id_token', 'El id token de google debe ser obligatorio').not().isEmpty(),
    validateFields
],googleSignIn);






module.exports = router