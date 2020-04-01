import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

import { 
  GET_ERRORS, 
  SET_CURRENT_USER, 
  USER_LOADING,
  UPDATE_USER_SUCCESS,
  RESET_AUTH_ERRORS,
  RESET_UPDATE_USER,
} from './types';
import apiClient from "../utils/apiClient";
import jwt_decode from "jwt-decode";

// Modified authentication code from https://github.com/rishipr/mern-auth/

const updateUserSuccess = () => ({
  type: UPDATE_USER_SUCCESS
});

const updateUserFailure = (error) => ({
  type: GET_ERRORS,
  payload: error
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
      let {token} = res.data;
      if (token) {
        // Update token
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
        dispatch(updateUserSuccess());
      }
    })
    .catch(err => {
      dispatch(updateUserFailure(err.response.data));
    })
}
export const resetUpdateUser = () => (dispatch) => {
  dispatch({
    type: RESET_UPDATE_USER
  })
};

/**
 * Remove specific auth errors 
 * @param {Array.<string>} values the keys to be removed 
 */
export const resetAuthErrors = (values) => (dispatch) => {
  dispatch({
    type: RESET_AUTH_ERRORS,
    values
  })
}