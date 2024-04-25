import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchDataDetail } from '../store/postSlice';
export default function DetailPost() {
  const dispatch = useDispatch();
  const targetData = useSelector((state) => state.post.postTarget);
  const loading = useSelector((state) => state.post.postLoading);
  let { id } = useParams();

  useEffect(() => {
    dispatch(fetchDataDetail(id));
  }, [id]);

  function timeSince(date) {
    let currentDate = new Date(date);
    var seconds = Math.floor((new Date() - currentDate) / 1000);

    var interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hours';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  }

  return (
    <>
      {targetData != undefined ? (
        <div
          className="container border shadow"
          style={{ marginTop: '15vh', marginBottom: '5vh', minHeight: '100vh' }}
        >
          <div className="row g-2">
            <div className="row">
              <div className="col-12">
                <div className="image weather">
                  <img
                    className="img-fluid w-100 h-100 p-4"
                    src={(targetData && targetData.imgUrl) || '...'}
                    alt="Food Image"
                    height="500px"
                    width="500px"
                  />
                </div>
              </div>
              <div className="col-12 ">
                <div className="food-info">
                  <div className="food-title mt-4 mb-2">
                    <h2>{targetData.title || 'no data'}</h2>
                  </div>
                  <div className="description">
                    <p
                      className="fs-4 mb-4 mt-4"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {(targetData && targetData.longDescription) || 'no data'}
                    </p>
                  </div>
                  <p
                    className="food-price fs-5"
                    style={{ fontFamily: '"Quintessential", serif' }}
                  >
                    Type: {(targetData && targetData.Type.name) || ''}
                  </p>
                  <p
                    className="food-price fs-5"
                    style={{ fontFamily: '"Quintessential", serif' }}
                  >
                    Author: {(targetData && targetData.User.email) || ''}
                  </p>
                  <p
                    className="food-price fs-5"
                    style={{ fontFamily: '"Quintessential", serif' }}
                  >
                    Created:{' '}
                    {targetData.createdAt
                      ? timeSince(targetData.createdAt)
                      : ''}{' '}
                    ago
                  </p>
                  <Link
                    className="btn btn-outline-primary w-100 mb-3"
                    to="/post"
                  >
                    Go back to post page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-5" style={{ minHeight: '100vh' }}>
          <h1>Loading data</h1>
        </div>
      )}
    </>
  );
}
