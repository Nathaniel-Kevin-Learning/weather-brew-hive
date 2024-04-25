const UserController = require('../controllers/UserController');

const router = require('express').Router();

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.post('/login/oauth', UserController.loginOauth);

router.use('/donation', require('./donation'));
router.use('/posts', require('./post'));
router.use('/types', require('./type'));
router.use('/weathers', require('./weather'));

module.exports = router;
