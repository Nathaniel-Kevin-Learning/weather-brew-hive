import { Link, useNavigate } from 'react-router-dom';
import weatherImage from '../assets/undraw_weather_re_qsmd.svg';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorSweetAlert from '../utils/ErrorSweetAlert';
import { jwtDecode } from 'jwt-decode';
import { useSelector, useDispatch } from 'react-redux';
import {
  changeEmail,
  changePassword,
  backToDefault,
  registerUser,
} from '../store/userSlice';
export default function Register() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const email = useSelector((state) => state.user.email);
  const password = useSelector((state) => state.user.password);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let submitHandler = async (e) => {
    e.preventDefault();
    let result = await dispatch(registerUser(email, password));
    if (result.success) {
      navigate('/login');
    }
  };

  async function handleCallbackResponse(response) {
    try {
      // console.log('Encoded JWT ID token:' + response.credential); //enable this only for testing purpose

      let { data } = await axios({
        url: import.meta.env.VITE_BASE_URL + '/login/oauth',
        method: 'POST',
        headers: {
          google_token: response.credential,
        },
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      navigate('/');
    } catch (error) {
      ErrorSweetAlert(error.response.data.message);
    }
  }
  useEffect(() => {
    // Global google
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
    });
  }, []);

  return (
    <>
      <section style={{ height: '100vh' }}>
        <div
          className="row text-center d-flex align-items-center justify-content-center  "
          style={{ minHeight: '100vh' }}
        >
          <div
            className="col-sm-6 col-md-6 d-flex align-items-center justify-content-center "
            style={{ height: '100vh' }}
          >
            <div className="container ">
              <img className="img-fluid" src={weatherImage} alt="" height="" />
            </div>
          </div>
          <div
            className="col-sm-6 col-md-6 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: '#9ff5f3', height: '100vh' }}
          >
            <div className="text-start">
              <div className="mb-3 text-center">
                <h1>Register</h1>
              </div>
              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <label htmlFor="formGroupExampleInput" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      dispatch(changeEmail(e.target.value));
                    }}
                    autoComplete="username"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="formGroupExampleInput2"
                    className="form-label"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="formGroupExampleInput2"
                    name="password"
                    value={password}
                    onChange={(e) => {
                      dispatch(changePassword(e.target.value));
                    }}
                    autoComplete="current-password"
                  />
                </div>

                <div className="col-12 mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Register
                  </button>
                </div>

                <div className="mt-3">
                  <p>
                    Do you have an account? <Link to={'/login'}> Login </Link>
                  </p>
                </div>
                <div className="mt-3 text-center">
                  <h6>
                    ------------------------------OR--------------------------
                  </h6>
                </div>
                <div className="mt-3 d-flex justify-content-center align-items-center">
                  <div id="signInDiv"></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
