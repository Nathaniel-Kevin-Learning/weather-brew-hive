import Form from '../components/Form';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchDataDetail } from '../store/postSlice';

export default function EditPostPage() {
  const dispatch = useDispatch();

  let { id } = useParams();

  useEffect(() => {
    dispatch(fetchDataDetail(id));
  }, []);
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
              <h1>Edit existing post</h1>
            </div>
            <Form mode="update" />
          </div>
        </div>
      </div>
    </>
  );
}
