import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import broadcastAction from './utils/broadcastAction';
import rootReducer from "./reducers";
import socket from './utils/socket';

const initialState = {};

const middleware = [thunk, broadcastAction(socket)];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
      compose
  )
);

export default store;
