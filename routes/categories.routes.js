const { check } = require('express-validator')
const {Router, response} = require('express');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT, haveARole } = require('../middlewares');
const { createCategorie, getCategorieById, getCategories, updateCategorie, deleteCategorie } = require('../controllers/categories.controller');
const { existCategorieById } = require('../helpers/db-validators');

const router = Router()


//para probar
// Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoria en particular por id - publico
// crear middleware personalizado para existCategorie
router.get('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existCategorieById),
    validateFields
] , getCategorieById);

// Crear categoria - privado - cualquier persona con token valido
router.post('/', [
    validateJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
] ,createCategorie);

// Actualizar categoria por id - privado - cualquier persona con token valido
router.put('/:id',[
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existCategorieById),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
] ,updateCategorie);

// Borrar categoria por id - privado - Solo un admin
router.delete('/:id', [
    validateJWT,
    haveARole('ADMIN_ROLE','SALES_ROLE'),
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existCategorieById),
    validateFields,
] ,deleteCategorie);


module.exports = router