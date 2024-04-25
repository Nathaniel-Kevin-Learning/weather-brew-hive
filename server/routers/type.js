const TypeController = require('../controllers/TypeController');
const Authentication = require('../middleware/Authentication');
const Authorization = require('../middleware/Authorization');
const AuthorizationCreatorOnly = require('../middleware/AuthorizationCreatorOnly');

const router = require('express').Router();

router.use(Authentication);

router.get('/', TypeController.getType);
router.post('/', Authorization, TypeController.postType);
router.put('/:id', Authorization, TypeController.updateType);
router.delete('/:id', Authorization, TypeController.deleteType);

module.exports = router;
