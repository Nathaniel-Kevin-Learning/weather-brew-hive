import { createSlice } from '@reduxjs/toolkit';
import ErrorSweetAlert from '../utils/ErrorSweetAlert';
import axios from 'axios';
import NormalSuccessSweetAlert from '../utils/NormalSuccessSweetAler';

export const postSlice = createSlice({
  name: 'post',
  initialState: {
    postData: [],
    postTarget: undefined,
    postLoading: false,
    totalPage: 1,
    currentPage: 1,
    type: '',
    sort: '',
    search: '',
  },
  reducers: {
    changeTarget: (state, action) => {
      state.postTarget = action.payload;
    },
    fetchPostData: (state, action) => {
      state.postData = action.payload;
    },
    fetchPostLoading: (state, action) => {
      state.postLoading = action.payload;
    },
    changeTotalPage: (state, action) => {
      state.totalPage = action.payload;
    },
    changeCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    changeType: (state, action) => {
      state.type = action.payload;
    },
    changeSort: (state, action) => {
      state.sort = action.payload;
    },
    changeSearch: (state, action) => {
      state.search = action.payload;
    },
    resetTarget: (state, action) => {
      state.postTarget = undefined;
    },
  },
});

export const {
  changeTarget,
  fetchPostData,
  fetchPostLoading,
  changeTotalPage,
  changeCurrentPage,
  changeType,
  changeSort,
  changeSearch,
  resetTarget,
} = postSlice.actions;

export function fetchData(pageNumber, type, sort, search) {
  return async function (dispatch, getState) {
    try {
      dispatch(fetchPostLoading(true));
      const { data } = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + '/posts',
        params: {
          'page[size]': 5,
          'page[number]': pageNumber,
          filter: type,
          sort: sort,
          search: search,
        },
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      dispatch(fetchPostData(data.data));
      dispatch(changeTotalPage(data.totalPage));
      dispatch(changeCurrentPage(data.page));
    } catch (error) {
      ErrorSweetAlert(error.response.data.message);
    } finally {
      dispatch(fetchPostLoading(false));
    }
  };
}

export function fetchDataDetail(id) {
  return async function (dispatch, getState) {
    try {
      dispatch(fetchPostLoading(true));
      const { data } = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + '/posts/' + id,

        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      dispatch(changeTarget(data));
    } catch (error) {
      ErrorSweetAlert(error.response.data.message);
    } finally {
      dispatch(fetchPostLoading(false));
    }
  };
}

export function postNewPost(dataPost) {
  return async function (dispatch, getState) {
    try {
      dispatch(fetchPostLoading(true));
      const { data } = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/posts',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        data: {
          title: dataPost.title,
          shortDescription: dataPost.shortDescription,
          longDescription: dataPost.longDescription,
          imgUrl: dataPost.imgUrl,
          typeId: dataPost.typeId,
        },
      });
      NormalSuccessSweetAlert('Success creating a post');
      return { success: true };
    } catch (error) {
      ErrorSweetAlert(error.response.data.message);
    } finally {
      dispatch(fetchPostLoading(false));
    }
  };
}

export function updatePost(dataPost, id) {
  return async function (dispatch, getState) {
    try {
      dispatch(fetchPostLoading(true));
      const { data } = await axios({
        method: 'put',
        url: import.meta.env.VITE_BASE_URL + '/posts/' + id,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        data: {
          title: dataPost.title,
          shortDescription: dataPost.shortDescription,
          longDescription: dataPost.longDescription,
          imgUrl: dataPost.imgUrl,
          typeId: dataPost.typeId,
        },
      });

      NormalSuccessSweetAlert('Success updating a post');
      dispatch(resetTarget());
      return { success: true };
    } catch (error) {
      ErrorSweetAlert(error.response.data.message);
    } finally {
      dispatch(fetchPostLoading(false));
    }
  };
}

export function deletePost(id) {
  return async function (dispatch, getState) {
    try {
      dispatch(fetchPostLoading(true));
      const { data } = await axios({
        method: 'delete',
        url: import.meta.env.VITE_BASE_URL + '/posts/' + id,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      dispatch(fetchData());
      NormalSuccessSweetAlert(data.message);
    } catch (error) {
      ErrorSweetAlert(error.response.data.message);
    } finally {
      dispatch(resetTarget());
      dispatch(fetchPostLoading(false));
    }
  };
}
export default postSlice.reducer;
