import React from 'react';
import homePicture from '../assets/undraw_weather_app_re_kcb1.svg';
import homePicture1 from '../assets/home_pic.jpg';
import weatherImage from '../assets/lightning-bolts.jpg';
export default function Home() {
  return (
    <>
      <div className="container-fluid bg-gradient">
        <div className="container bg-light mt-5 py-5">
          <div className="row justify-content-center align-items-center g-2">
            <div className="col-sm-12 col-md-6 p-3">
              <div className="HelloBar text-center">
                <h1>Welcome to Weather Brew Hive</h1>
              </div>
              <div className="subtitle text-center">
                <p className="fs-4">Brewing precision in weather forecasting</p>
                <a href="#cta" className="btn btn-primary btn-lg mt-3">
                  Explore Now
                </a>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="container p-4">
                <img
                  src={homePicture}
                  alt="Weather Brew Hive"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
          <div className="row g-2 bg-dark text-white p-3 mt-2" id="cta">
            <div className="col-sm-12 col-md-6 p-3 align-items-center justify-content-center">
              <img
                src={homePicture1}
                alt="Weather Brew Hive"
                style={{
                  maxWidth: '100%',
                  padding: '2vh',
                  maxHeight: '80vh',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="col-sm-12 col-md-6 mt-5">
              <div className="title">
                <h5 className="text-danger">A little About</h5>
                <h2>Weather Brew Hive</h2>
              </div>
              <div className="details mt-3">
                <p className="fs-5">
                  Welcome to Weather Brew Hive! We are your premier destination
                  for accurate and reliable weather forecasting. Our mission is
                  to provide users with up-to-date weather information to help
                  them plan and prepare for any conditions. At Weather Brew
                  Hive, we understand the importance of staying informed about
                  the weather, whether it's for daily routines, outdoor
                  activities, or travel plans. Our team is dedicated to
                  delivering precise forecasts and keeping you ahead of any
                  weather-related surprises.
                </p>
              </div>
            </div>
          </div>
          <div
            className="row g-2 bg-light text-dark p-3 mt-2 mt-5 mb-5"
            id="cta"
          >
            <h1 className="text-dark text-center mb-4">Our Commitment</h1>
            <div className="row">
              <div className="col-sm-12 col-md-4">
                <p className="text-center">
                  <i
                    className="fa fa-bullseye"
                    aria-hidden="true"
                    style={{ fontSize: '5em' }}
                  ></i>
                </p>
                <p>
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Accuracy: We prioritize accuracy in our forecasts, using the
                  latest technology and data to provide reliable weather
                  information.
                </p>
              </div>
              <div className="col-sm-12 col-md-4">
                <p className="text-center">
                  <i
                    className="fa fa-universal-access"
                    aria-hidden="true"
                    style={{ fontSize: '5em' }}
                  ></i>
                </p>
                <p>
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Accessibility: Weather Brew Hive is designed to be accessible
                  and easy to use for everyone, regardless of location or
                  device.
                </p>
              </div>
              <div className="col-sm-12 col-md-4">
                <p className="text-center">
                  <i
                    className="fa fa-address-book"
                    aria-hidden="true"
                    style={{ fontSize: '5em' }}
                  ></i>
                </p>
                <p>
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Community: Join our community of weather enthusiasts and
                  professionals who share a passion for understanding and
                  tracking weather patterns.
                </p>
              </div>
            </div>
          </div>
          <div className="row g-2 bg-dark text-light p-3 mt-2" id="cta">
            <h1 className="text-danger text-center mb-4">
              Weather Forecasting
            </h1>
            <div className="col-sm-12 col-md-6 mt-5">
              <div className="title">
                <h2>Forecasting</h2>
              </div>
              <div className="details mt-3">
                <p>
                  <strong>What is Weather Forecasting?</strong>
                  <br />
                  Weather forecasting is the process of predicting the state of
                  the atmosphere at a specific location and time in the future.
                  It involves analyzing various meteorological data, such as
                  temperature, humidity, wind speed, and atmospheric pressure,
                  to make educated predictions about future weather conditions.
                  <br />
                  <br />
                  <strong>Why Weather Forecasting Apps are Created:</strong>
                  <br />
                  <li>
                    <strong>Planning and Preparedness:</strong> Weather
                    forecasting apps help individuals, businesses, and
                    organizations plan their activities and make informed
                    decisions based on anticipated weather conditions.
                  </li>
                  <li>
                    <strong>Safety and Risk Management:</strong> Accurate
                    weather forecasts are essential for protecting lives and
                    property from weather-related hazards such as storms,
                    hurricanes, floods, and wildfires.
                  </li>
                  <li>
                    <strong>Resource Management:</strong> Weather forecasts play
                    a crucial role in managing natural resources such as water,
                    energy, and agriculture.
                  </li>
                  <li>
                    <strong>Business Operations:</strong> Many industries rely
                    heavily on weather conditions for their daily operations.
                  </li>
                  <li>
                    <strong>Scientific Research:</strong> Weather forecasting
                    apps contribute to advancing scientific research and
                    understanding of Earth's climate system.
                  </li>
                </p>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 mt-5 d-flex align-items-center p-3">
              <img
                src={weatherImage}
                alt="Weather Brew Hive"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
