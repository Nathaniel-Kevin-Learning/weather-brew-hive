import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import ErrorSweetAlert from '../utils/ErrorSweetAlert';
import { useSelector, useDispatch } from 'react-redux';
import {
  changeTarget,
  fetchPostData,
  fetchPostLoading,
  changeTotalPage,
  changeCurrentPage,
  changeType,
  changeSort,
  changeSearch,
  fetchData,
} from '../store/postSlice';
import { fetchDataType } from '../store/typeSlice';
import PostCards from '../components/PostCards';
import { Link } from 'react-router-dom';
import ModalDeletePost from '../components/ModalDeletePost';
export default function Post() {
  const dataPost = useSelector((state) => state.post.postData);
  const postLoading = useSelector((state) => state.post.postLoading);
  const totalPage = useSelector((state) => state.post.totalPage);
  const currentPage = useSelector((state) => state.post.currentPage);
  const type = useSelector((state) => state.post.type);
  const sort = useSelector((state) => state.post.sort);

  const search = useSelector((state) => state.post.search);
  const typeData = useSelector((state) => state.type.typeData);

  const dispatch = useDispatch();

  const handleSearch = (event) => {
    event.preventDefault();
    const searchValue = event.target.search.value;
    dispatch(changeSearch(searchValue));
    dispatch(changeCurrentPage(1));
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      let nextPage = Number(currentPage) + 1;
      dispatch(changeCurrentPage(nextPage));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      let prevPage = Number(currentPage) - 1;
      dispatch(changeCurrentPage(prevPage));
    }
  };

  const handlePageChange = (page) => {
    dispatch(changeCurrentPage(page));
  };

  useEffect(() => {
    dispatch(fetchData(currentPage, type, sort, search));
    dispatch(fetchDataType());
  }, [type, sort, currentPage, search]);

  return (
    <>
      <div className="container mt-5 mb-5">
        <div style={{ minHeight: '100vh' }}>
          <div className="text-center" style={{ marginTop: '10vh' }}>
            <h1>Post page</h1>
          </div>
          <div className="row g-3 align-items-center mt-5 mb-5">
            <div className="col-md-6">
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <input
                    type="search"
                    name="search"
                    className="form-control"
                    placeholder="Search..."
                    disabled={postLoading}
                  />
                  <button className="btn btn-primary" type="submit">
                    Search
                  </button>
                </div>
              </form>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                name="type"
                disabled={postLoading}
                value={type}
                onChange={(e) => {
                  dispatch(changeCurrentPage(1));
                  dispatch(changeType(e.target.value));
                }}
              >
                <option value="">Post type</option>
                {typeData &&
                  typeData.map((el) => (
                    <option value={el.id} key={el.id}>
                      {el.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                name="sort"
                value={sort}
                onChange={(e) => {
                  dispatch(changeCurrentPage(1));
                  dispatch(changeSort(e.target.value));
                }}
                disabled={postLoading}
              >
                <option value="">Sort by release date</option>
                <option value="-">Sort by latest release date</option>
                <option value="+">Sort by oldest release date</option>
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12 text-end">
              {localStorage.getItem('role') === 'Admin' && (
                <Link
                  className="btn btn-success"
                  type="button"
                  to={'/post/add-page'}
                >
                  <i className="fas fa-plus me-2"></i> Add Post
                </Link>
              )}
            </div>
          </div>
          {/* card start here */}
          {postLoading ? (
            <>
              <div className="text-danger text-center">
                <h1>Loading post...</h1>
              </div>
            </>
          ) : (
            dataPost &&
            (dataPost.length != 0 ? (
              dataPost.map((el) => <PostCards key={el.id} data={el} />)
            ) : (
              <>
                <div className="text-danger text-center">
                  <h1>There is no post</h1>
                </div>
              </>
            ))
          )}

          <div className="mt-2">
            <ul className="pagination align-items-center justify-content-center mt-4 text-center">
              <li className="page-item">
                <button className="page-link" onClick={handlePrevPage}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPage }, (_, key) => (
                <li
                  className={`page-item ${
                    currentPage == key + 1 ? 'active' : ''
                  }`}
                  key={key}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(key + 1)}
                  >
                    {key + 1}
                  </button>
                </li>
              ))}
              <li className="page-item">
                <button className="page-link" onClick={handleNextPage}>
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* <ModalAddPost /> */}
      <ModalDeletePost />
    </>
  );
}
