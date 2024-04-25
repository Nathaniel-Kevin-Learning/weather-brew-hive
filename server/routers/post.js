const PostController = require('../controllers/PostController');
const Authentication = require('../middleware/Authentication');
const Authorization = require('../middleware/Authorization');
const AuthorizationCreatorOnly = require('../middleware/AuthorizationCreatorOnly');

const router = require('express').Router();

router.use(Authentication);

router.get('/', PostController.fetchPost);
router.post('/', Authorization, PostController.postingPost);
router.put(
  '/:id',
  Authorization,
  AuthorizationCreatorOnly,
  PostController.updatePost
);
router.delete(
  '/:id',
  Authorization,
  AuthorizationCreatorOnly,
  PostController.deletePost
);
router.get('/:id', PostController.fetchPostById);

module.exports = router;
