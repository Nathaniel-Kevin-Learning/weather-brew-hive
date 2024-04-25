import axios from 'axios';
import { useState } from 'react';
import SweetAlert from '../utils/SweetAlert';
import ErrorSweetAlert from '../utils/ErrorSweetAlert';
import SuccessSweetAlert from '../utils/SuccessSweetAlert';

export default function DontationButton() {
  {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const handleDonateClick = () => {
      setModalIsOpen(true);
    };

    const handleModalClose = () => {
      setModalIsOpen(false);
    };

    const handleNameChange = (e) => {
      setName(e.target.value);
    };

    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };

    const handleAmountChange = (e) => {
      setAmount(e.target.value);
    };

    const handleDonateSubmit = async (e) => {
      e.preventDefault();
      try {
        let { data } = await axios({
          url: import.meta.env.VITE_BASE_URL + '/donation',
          method: 'POST',
          data: {
            name: name,
            donation: amount,
          },
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });

        window.snap.pay(data.token, {
          onSuccess: function () {
            SuccessSweetAlert('Payment has been successfull');
            setModalIsOpen(false);
          },
          onClose: function () {
            SweetAlert('Payment can be completed through your email.');
            setModalIsOpen(false);
          },
        });
      } catch (error) {
        ErrorSweetAlert(error.response.data.message);
        setModalIsOpen(false);
      }
    };

    return (
      <div>
        <button
          onClick={handleDonateClick}
          className="btn btn-lg btn-primary rounded-circle shadow"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
        >
          <i className="fas fa-heart"></i>
        </button>
        <div
          className={`modal ${modalIsOpen ? 'show' : ''}`}
          style={{ display: modalIsOpen ? 'block' : 'none' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter your details to donate:</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleModalClose}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleDonateSubmit}>
                  <div className="form-group mb-3">
                    <label>Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={handleNameChange}
                    />
                  </div>
                  <div className="form-group mb-5">
                    <label>Amount:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={amount}
                      onChange={handleAmountChange}
                    />
                  </div>
                  <div className="d-flex align-item-center justify-content-center">
                    <button type="submit" className="btn btn-primary">
                      Donate
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {modalIsOpen && (
          <div
            className="modal-backdrop fade show"
            onClick={handleModalClose}
          ></div>
        )}
      </div>
    );
  }
}
