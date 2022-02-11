const { check } = require('express-validator')
const {Router, response} = require('express');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT, haveARole } = require('../middlewares');
const { existCategorieById, existProductById, productNameExist } = require('../helpers/db-validators');
const { createProduct, getProducts, getProductsById, updateProduct, deleteProduct } = require('../controllers/product.controller')

const router = Router()

router.get('/', getProducts);

router.get('/:id', [
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existProductById),
    validateFields,
] ,getProductsById);

router.post('/',[
    validateJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categorie', 'La categoria debe existir').not().isEmpty(),
    check('categorie').custom(existCategorieById),
    validateFields,
] , createProduct );

router.put('/:id', [
    validateJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categorie', 'La categoria debe existir').not().isEmpty(),
    check('categorie').custom(existCategorieById),
    check('id').custom(existProductById),
    validateFields,
] ,updateProduct);

router.delete('/:id', [
    validateJWT,
    haveARole('ADMIN_ROLE','SALES_ROLE'),
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existProductById),
    validateFields,
],deleteProduct);

module.exports = router