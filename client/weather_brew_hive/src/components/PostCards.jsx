import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { changeTarget } from '../store/postSlice';

export default function PostCards({ data }) {
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

  const dispatch = useDispatch();

  return (
    <div className="card mb-3 w-100 h-100">
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={data.imgUrl}
            className="img-fluid rounded-start h-100 w-100"
            alt="..."
          />
        </div>
        <div className="col-md-8 d-flex flex-column">
          <div className="card-body">
            <h5 className="card-title">
              <Link to={`/post/${data.id}`}>{data.title}</Link>
            </h5>
            <p className="card-text">{data.shortDescription}</p>
            <p className="card-text">
              <small className="text-muted">
                created at {timeSince(data.createdAt)} ago
              </small>
            </p>
          </div>
          {localStorage.getItem('role') == 'Admin' && (
            <div className="mt-auto card-footer">
              <div className="d-flex justify-content-end">
                <Link
                  className="btn btn-primary me-2"
                  to={`/post/edit/${data.id}`}
                >
                  <i className="fas fa-edit"></i> Update
                </Link>
                <button
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deletePost"
                  onClick={() => {
                    dispatch(changeTarget(data));
                  }}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
