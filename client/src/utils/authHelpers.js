import axios from "axios";
import apiClient from './apiClient';
import jwt_decode from "jwt-decode";
import store from '../store';
import { setCurrentUser, logoutUser, resetUpdateUser } from "../actions/authActions";

export const setAuthToken = token => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

/**
 * Checks if token still holds valid credentials
 * @param {string}   token The authentication token
 * @return {boolean}       True if token credentials match the database   
 */
const checkTokenValid = async (token) => {
  const decoded = jwt_decode(token);
  try {
    let res = await apiClient.getUser(decoded.id);
    return (decoded.name === res.data.name) && (decoded.email === res.data.email);
  }
  catch (err) {
    return false;
  }
};

export const checkForToken = async () => {
  if (localStorage.jwtToken) {
    const token = localStorage.jwtToken;
    const decoded = jwt_decode(token);

    setAuthToken(token);
    let isValid = await checkTokenValid(token)
    // Check if credentials have changed or token expired
    if (!isValid || decoded.exp < (Date.now() / 1000)) {
      // Logout user
      store.dispatch(logoutUser());
      // Redirect to login
      window.location.href = "/";
    }
    else {
      store.dispatch(setCurrentUser(decoded));
    }
  }
}