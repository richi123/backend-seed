const { check } = require('express-validator')
const {Router} = require('express');

const { usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch } = require('../controllers/user.controller');

const {
    validateFields,
    validateJWT,
    isAdminRole,
    haveARole,
} = require('../middlewares')

const { isValidRole, emailExist, userIdExist } = require('../helpers/db-validators');

const router = Router()

router.get('/', usuariosGet);
router.put('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom( userIdExist ),
    check('role').custom( isValidRole ),
    validateFields
] ,usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 letras').isLength({min:6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExist ),
    // check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isValidRole ),
    validateFields
] ,usuariosPost);

router.delete('/:id',[
    validateJWT,
    //isAdminRole,
    haveARole('ADMIN_ROLE','SALES_ROLE'),
    check('id','No es un id valido').isMongoId(),
    check('id').custom( userIdExist ),
    validateFields
] ,usuariosDelete);
router.patch('/', usuariosPatch);

module.exports = router;