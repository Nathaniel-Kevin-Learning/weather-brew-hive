const axios = require('axios');
const formatDateTime = require('../helpers/formatter');

class WeatherController {
  static async getWeatherData(req, res, next) {
    try {
      let inputs = req.query;

      let { data } = await axios({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${inputs.location}&cnt=9&appid=${process.env.OPEN_WEATHER_API}&units=metric`,
      });

      const city = data.city.name;
      const weatherData = await data.list.map((item) => {
        return {
          dateTime: formatDateTime(item.dt_txt),
          weather: {
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          },
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
        };
      });

      res.status(200).json({ city, weather: weatherData });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = WeatherController;
