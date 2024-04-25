import React, { useEffect, useState } from 'react';
import ForecastCards from '../components/ForecastCards';
import ErrorSweetAlert from '../utils/ErrorSweetAlert';
import axios from 'axios';
import imageForecast from '../assets/DCT_SPECIAL34_1280x720.jpg';

export default function ForecastPage() {
  const [dataWeatherDatabase, setDataWeatherDatabase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(3);
  const [city, setCity] = useState('Jakarta');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (location = 'jakarta') => {
    try {
      setLoading(true);
      const { data } = await axios({
        url: import.meta.env.VITE_BASE_URL + '/weathers',
        method: 'get',
        params: {
          location,
        },
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      setDataWeatherDatabase(data.weather);
      setCity(data.city);
    } catch (error) {
      ErrorSweetAlert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const searchHandler = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    setCurrentPage(1);
    fetchData(searchValue);
  };

  const indexOfLastData = currentPage * perPage;
  const indexOfFirstData = indexOfLastData - perPage;
  const currentData = dataWeatherDatabase.slice(
    indexOfFirstData,
    indexOfLastData
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="container mt-5 mb-5">
        <div style={{ minHeight: '100vh' }}>
          <div className="row g-3 align-items-center mt-5 mb-5">
            <div>
              <div
                className="col text-center mt-5"
                style={{ marginTop: '10vh' }}
              >
                <h1>Forecast page</h1>
              </div>
              <div
                className="col col-sm-12 mt-4"
                style={{ backgroundColor: '#a2aba5', borderRadius: '10px' }}
              >
                <div className="weather-forecast-container mb-5">
                  <div className="row">
                    <div className="col-md-6 col-sm-12">
                      <div className="text-center ">
                        <img
                          src={imageForecast}
                          alt="..."
                          className="img-fluid h-100"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 fs-6 mt-3">
                      <h4>Understanding Weather Forecasting</h4>
                      <p>
                        Weather forecasting is the process of predicting the
                        state of the atmosphere at a particular location and
                        time. It involves analyzing various meteorological data
                        to provide information about future weather conditions.
                      </p>
                      <p>
                        Accurate weather forecasts are essential for planning
                        activities, agricultural practices, aviation, and
                        disaster preparedness. By understanding weather patterns
                        and trends, forecasters can help individuals and
                        organizations make informed decisions to stay safe and
                        maximize efficiency.
                      </p>
                      <div className="text-center">
                        <a
                          href="#forecastPlace"
                          className="btn btn-primary btn-lg "
                        >
                          Forecast Now
                        </a>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <form onSubmit={searchHandler}>
                <div className="input-group">
                  <input
                    type="search"
                    name="search"
                    className="form-control"
                    placeholder="Search Country (Geocode)"
                  />
                  <button className="btn btn-primary" type="submit">
                    Search
                  </button>
                </div>
              </form>
              <label>
                <span className="text-danger fw-bold">*</span> Geocode is the
                same as country name
              </label>
            </div>
          </div>
          <div
            className="row d-flex align-items-center justify-content-center"
            id="forecastPlace"
          >
            {!loading ? (
              <div className="container p-3">
                <div
                  className="card mb-3 shadow "
                  style={{ borderRadius: '10px' }}
                >
                  <div className="card-header text-center">
                    <h3>Forecast in {city}</h3>
                  </div>
                  <div className="card-body">
                    <p>
                      You can view the 24-hour forecast for {city} here. Use the
                      search bar to find forecasts for other countries and
                      places.
                    </p>
                    <div className="card-group">
                      {currentData &&
                        currentData.map((forecast, index) => (
                          <ForecastCards key={index} data={forecast} />
                        ))}
                    </div>
                    <div className="mt-2">
                      <ul className="pagination align-items-center justify-content-center mt-4 text-center">
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => {
                              if (currentPage != 1) {
                                paginate(currentPage - 1);
                              }
                            }}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from(
                          {
                            length: Math.ceil(
                              dataWeatherDatabase.length / perPage
                            ),
                          },
                          (_, key) => (
                            <li
                              className={`page-item ${
                                currentPage === key + 1 ? 'active' : ''
                              }`}
                              key={key}
                            >
                              <button
                                className="page-link"
                                onClick={() => paginate(key + 1)}
                              >
                                {key + 1}
                              </button>
                            </li>
                          )
                        )}
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => {
                              if (currentPage != 3) {
                                paginate(currentPage + 1);
                              }
                            }}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h1>Loading Data...</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
