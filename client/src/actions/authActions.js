import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

import { 
  GET_ERRORS, 
  SET_CURRENT_USER, 
  USER_LOADING,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
} from './types';
import apiClient from "../utils/apiClient";

// Modified authentication code from https://github.com/rishipr/mern-auth/

const updateUserSuccess = (user) => ({
  type: UPDATE_USER_SUCCESS,
  user
});

const updateUserFailure = (error) => ({
  type: UPDATE_USER_FAILURE,
  error
});


// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = (userData) => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      window.location.href = '/';
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  window.location.href = '/'
};

// Update user
export const updateUser = (userId, values) => (dispatch) => {
  apiClient.updateUser(userId, values)
    .then(res => {
      dispatch(updateUserSuccess(res.data));
    })
    .catch(err => {
      dispatch(updateUserFailure(err.response.data));
    })
}