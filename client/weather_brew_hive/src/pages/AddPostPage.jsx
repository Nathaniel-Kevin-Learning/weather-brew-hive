import { useDispatch } from 'react-redux';
import Form from '../components/Form';
import { useEffect } from 'react';
import { resetTarget } from '../store/postSlice';

export default function AddPostPage() {
  return (
    <>
      <div
        className="container d-flex mb-5 align-items-center justify-content-center"
        style={{ minHeight: '100vh', marginTop: '100px' }}
      >
        <div
          className="row d-flex align-items-center justify-content-center border shadow w-50"
          style={{ minHeight: '30vh' }}
        >
          <div className="col">
            <div className="text-center mt-3 mb-3">
              <h1>Add new post</h1>
            </div>
            <Form mode="create" />
          </div>
        </div>
      </div>
    </>
  );
}
