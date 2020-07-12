import axios from 'axios';
import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKE,
  DELETE_POST,
  ADD_POST,
  CLEAR_POST,
  ADD_COMMENT,
  DELETE_COMMENT,
} from './types';
import { setAlert } from './alert';

// Get Posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/posts');

    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Get single Post
export const getPost = (id) => async (dispatch) => {
  dispatch({ type: CLEAR_POST });
  try {
    const res = await axios.get(`/api/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

export const CLEAR = () => (dispatch) => {
  dispatch({ type: CLEAR_POST });
};

// Add Like
export const addLike = (id) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKE,
      payload: { id, likes: res.data },
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Remove Like
export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKE,
      payload: { id, likes: res.data },
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Delete Post
export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id,
    });

    dispatch(setAlert('Post deleted', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });

    dispatch(setAlert(error.response.statusText, 'danger'));
  }
};

export const addPost = (formData) => async (dispatch) => {
  try {
    // Configuring the Data
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/posts', formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data,
    });

    dispatch(setAlert('Post Created', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.map((err) => dispatch(setAlert(err.msg, 'danger')));
    }

    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// AddComment
export const addComment = (id, formData) => async (dispatch) => {
  try {
    // Configuring the Data
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(`/api/posts/comment/${id}`, formData, config);

    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });

    dispatch(setAlert('Comment Added', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Remove Comment
export const removeComment = (post_id, comment_id) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/comment/${post_id}/${comment_id}`);

    dispatch({
      type: DELETE_COMMENT,
      payload: comment_id,
    });

    dispatch(setAlert('Delete Comment', 'danger'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
