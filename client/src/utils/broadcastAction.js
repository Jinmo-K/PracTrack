import {
  ADD_ACTIVITY_SUCCESS,
  UPDATE_ACTIVITY_SUCCESS,
  DELETE_ACTIVITY_SUCCESS,
  UPDATE_USER_SUCCESS,
  SET_CURRENT_USER,
  ADD_LOG_SUCCESS,
  UPDATE_LOG_SUCCESS,
  DELETE_LOG_SUCCESS,
} from '../actions/types';

// Actions that should be reflected across devices
const mirroredActions = [
  ADD_ACTIVITY_SUCCESS,
  UPDATE_ACTIVITY_SUCCESS,
  DELETE_ACTIVITY_SUCCESS,
  UPDATE_USER_SUCCESS,
  SET_CURRENT_USER,
  ADD_LOG_SUCCESS,
  UPDATE_LOG_SUCCESS,
  DELETE_LOG_SUCCESS,
];

// Middleware for broadcasting actions via sockets
export default socket => store => next => action => {
  var state = store.getState();
  if (mirroredActions.includes(action.type) && state.auth.user.id && !action.remote) {
    socket.emit('new action', { userId: state.auth.user.id, action });
  }
  return next(action);
}