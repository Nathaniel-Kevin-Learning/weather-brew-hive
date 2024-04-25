import { useSelector, useDispatch } from 'react-redux';
import { fetchDataType } from '../store/typeSlice';
import { useEffect, useState } from 'react';
import { postNewPost, updatePost } from '../store/postSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
export default function Form({ mode }) {
  const postLoading = useSelector((state) => state.post.postLoading);
  const typeData = useSelector((state) => state.type.typeData);
  const [formData, setFormData] = useState({
    title: undefined,
    shortDescription: undefined,
    longDescription: undefined,
    imgUrl: undefined,
    typeId: undefined,
  });

  let { id } = useParams();
  const targetData = useSelector((state) => state.post.postTarget);
  const navigate = useNavigate();

  let handlerChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  let handlerSubmit = async (e) => {
    e.preventDefault();
    let result = await dispatch(postNewPost(formData));
    if (result.success) {
      navigate('/post');
    }
  };

  let handlerUpdate = async (e) => {
    e.preventDefault();
    let result = await dispatch(updatePost(formData, id));
    if (result.success) {
      navigate('/post');
    }
  };

  useEffect(() => {
    dispatch(fetchDataType());

    if (targetData && mode != 'create') {
      let title = targetData.title;
      let shortDescription = targetData.shortDescription;
      let longDescription = targetData.longDescription;
      let imgUrl = targetData.imgUrl;
      let typeId = targetData.typeId;
      setFormData({
        ...formData,
        title,
        shortDescription,
        longDescription,
        imgUrl,
        typeId,
      });
    }
  }, [targetData]);

  const dispatch = useDispatch();

  return (
    <>
      <form onSubmit={mode == 'create' ? handlerSubmit : handlerUpdate}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title{' '}
            <span className="text-danger">
              <strong>*</strong>
            </span>
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handlerChange}
            disabled={postLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="shortDescription" className="form-label">
            Short Description{' '}
            <span className="text-danger">
              <strong>*</strong>
            </span>
          </label>
          <input
            type="text"
            className="form-control"
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handlerChange}
            disabled={postLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="longDescription" className="form-label">
            Long Description{' '}
            <span className="text-danger">
              <strong>*</strong>
            </span>
          </label>
          <div className="form-floating">
            <textarea
              className="form-control"
              placeholder="Leave a comment here"
              id="floatingTextarea2"
              style={{ height: 100 }}
              name="longDescription"
              value={formData.longDescription}
              onChange={handlerChange}
              disabled={postLoading}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">
            Image Url{' '}
            <span className="text-danger">
              <strong>*</strong>
            </span>
          </label>
          <input
            type="text"
            className="form-control"
            id="imageUrl"
            name="imgUrl"
            value={formData.imgUrl}
            onChange={handlerChange}
            disabled={postLoading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Post type{' '}
            <span className="text-danger">
              <strong>*</strong>
            </span>
          </label>
          <select
            className="form-select"
            name="typeId"
            value={formData.typeId}
            onChange={handlerChange}
            disabled={postLoading}
          >
            <option value={undefined}>Post type</option>
            {typeData &&
              typeData.map((el) => (
                <option value={el.id} key={el.id}>
                  {el.name}
                </option>
              ))}
          </select>
        </div>

        {mode != 'create' ? (
          <div
            className="mb-3"
            style={{ fontFamily: '"Quintessential", serif' }}
          >
            Post Author : {(targetData && targetData.User.email) || ''}
          </div>
        ) : (
          <></>
        )}

        <div className="text-center mb-5 mt-3">
          <div className="row gx-2">
            <div className="col">
              <Link to={'/post'} className="btn btn-secondary w-100">
                Back
              </Link>
            </div>
            <div className="col">
              <button type="submit " className="btn btn-primary w-100">
                {mode == 'create' ? 'Submit' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
