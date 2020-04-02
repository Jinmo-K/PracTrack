import {
  ADD_LOG_SUCCESS,
  GET_ACTIVITY_LOGS_SUCCESS,
  DELETE_LOG_SUCCESS,
  FLUSH_LOGS,
  UPDATE_LOG_SUCCESS
} from '../actions/types';

// log: { 
//         userId:,
//         activityId:,
//         start:,
//         end:,
//         duration:,
//         comments: 
// }        

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_LOG_SUCCESS:
      return [...state, action.log];

    case UPDATE_LOG_SUCCESS:
      return state.map(log => {
        if (log._id === action.log._id) {
          return action.log;
        }
        return log;
      })

    case DELETE_LOG_SUCCESS:
      return state.filter(log => log._id !== action.log._id);

    case GET_ACTIVITY_LOGS_SUCCESS:
      return action.logs;

    case FLUSH_LOGS:
      return [];

    default:
      return state;
  }
};