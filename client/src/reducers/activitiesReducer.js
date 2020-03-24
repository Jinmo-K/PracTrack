import {
  GET_ACTIVITIES_SUCCESS,
  ADD_ACTIVITY_SUCCESS,
  DELETE_ACTIVITY_SUCCESS,
  UPDATE_ACTIVITY_SUCCESS,
  ADD_LOG_SUCCESS,
  DELETE_LOG_SUCCESS,
} from '../actions/types';

// activity: {
//     userId: ,
//     title: ,
//     totalDuration: ,
//     logs: [ids],
//     created:,
//     updated:,
//     active:,
//     start:,
//     goal:
// }

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ACTIVITIES_SUCCESS:
      return action.activities;

    case ADD_ACTIVITY_SUCCESS:
      return [...state, action.activity];

    case DELETE_ACTIVITY_SUCCESS:
      return state.filter(activity => activity._id !== action.activityId);

    case UPDATE_ACTIVITY_SUCCESS:
      return state.map(activity => {
        if (activity._id === action.activity._id) {
          return action.activity;
        }
        return activity;
      });

    case ADD_LOG_SUCCESS:
      return state.map(activity => {
        if (activity._id === action.log.activityId) {
          return {
            ...activity,
            totalDuration: activity.totalDuration + action.log.duration,
            logs: [...activity.logs, action.log._id],
            updated: action.log.created,
          };
        }
        return activity;
      });

    case DELETE_LOG_SUCCESS:
      return state.map(activity => {
        if (activity._id === action.log.activityId) {
          return {
            ...activity,
            totalDuration: activity.totalDuration - action.log.duration,
            logs: activity.logs.filter(log => log !== action.log._id),
            updated: Date.now(),
          };
        }
        return activity;
      });

    default:
      return state;
  }
};