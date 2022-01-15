const { check } = require('express-validator')
const {Router} = require('express');
const { login } = require('../controllers/auth.controller');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router()

router.post('/login', [
    check('correo', 'El correo debe ser obligatorio').isEmail(),
    check('password', 'La contraseña debe ser obligatoria').not().isEmpty(),
    validateFields
],login);






module.exports = router