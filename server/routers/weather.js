router = require('express').Router();
const WeatherController = require('../controllers/WeatherController');
const Authentication = require('../middleware/Authentication');

router.use(Authentication);
router.get('/', WeatherController.getWeatherData);

module.exports = router;
