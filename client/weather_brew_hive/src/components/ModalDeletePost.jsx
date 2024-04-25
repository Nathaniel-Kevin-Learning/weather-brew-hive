import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../store/postSlice';

export default function ModalDeletePost() {
  const dataTarget = useSelector((state) => state.post.postTarget);
  const dispatch = useDispatch();
  return (
    <div
      className="modal fade"
      id="deletePost"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">
              Deleting post
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete this post{' '}
              <strong>"{dataTarget && dataTarget.title}"</strong>
            </p>
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  className="btn btn-secondary w-100 p-2 "
                  data-bs-dismiss="modal"
                  onClick={() => {
                    dispatch(resetTarget());
                  }}
                >
                  Cancel
                </button>
              </div>
              <div className="col">
                <button
                  type="submit"
                  className="btn btn-primary w-100 p-2 "
                  data-bs-dismiss="modal"
                  onClick={() => {
                    dispatch(deletePost(dataTarget.id));
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
