export default function ForecastCards({ data }) {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <p className="card-title">
            <small>
              <strong>{data.dateTime}</strong>
            </small>
          </p>
          <p className="card-text">{data.weather.description}</p>
          <img
            src={`https://openweathermap.org/img/w/${data.weather.icon}.png`}
            alt="Scattered Clouds"
            className="weather-icon"
          />
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <i className="fas fa-tint"></i> Humidity: {data.humidity}%
            </li>
            <li className="list-group-item">
              <i className="fas fa-wind"></i> Wind Speed: {data.windSpeed} m/s
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
