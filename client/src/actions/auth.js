import Axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_DATA,
} from '../actions/types';

import setAuthToken from '../utils/setAuthToken';

// Loading User
// So we can load user in every request
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await Axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  // Configuring the Data
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await Axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      //getting the token here//
      // res.json({token})
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (error) {
    // res.json({errors : errors.array()  })
    const errors = error.response.data.errors;

    if (errors) {
      // Setting the server side Error here
      errors.map((err) => dispatch(setAlert(err.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  // Configuring the Data
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await Axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      //getting the token here//
      // res.json({token})
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (error) {
    // res.json({errors : errors.array()  })
    const errors = error.response.data.errors;

    if (errors) {
      // Setting the server side Error here
      errors.map((err) => dispatch(setAlert(err.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// LOGOUT
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_DATA });
  dispatch({ type: LOGOUT });
};
