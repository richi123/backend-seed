const { check } = require('express-validator')
const {Router} = require('express');
const { validateFields, validateFiledUpload } = require('../middlewares');
const { loadFile, updateUserImage, showImage, updateUserImageCloudinary } = require('../controllers/uploads.controller');
const { allowedCollections } = require('../helpers/db-validators');

const router = Router()


router.post('/', validateFiledUpload , loadFile)

router.put('/:collection/:id', [
    validateFiledUpload,
    check('id').isMongoId(),
    check('collection').custom( c => allowedCollections (c, ['users', 'products']) ),
    validateFields
], updateUserImageCloudinary)
//], updateUserImage)

router.get('/:collection/:id', [
    check('id').isMongoId(),
    check('collection').custom( c => allowedCollections (c, ['users', 'products']) ),
    validateFields
], showImage)



module.exports = router