import {
  GET_ACTIVITIES_BEGIN,
  GET_ACTIVITIES_SUCCESS,
  GET_ACTIVITIES_FAILURE,
  ADD_ACTIVITY_SUCCESS,
  ADD_ACTIVITY_FAILURE,
  DELETE_ACTIVITY_SUCCESS,
  DELETE_ACTIVITY_FAILURE,
  GET_ACTIVITY_LOGS_BEGIN,
  GET_ACTIVITY_LOGS_SUCCESS,
  GET_ACTIVITY_LOGS_FAILURE,
  RESET_ADD_ACTIVITY,
  FLUSH_LOGS,
  DELETE_LOG_SUCCESS,
  DELETE_LOG_FAILURE,
  UPDATE_LOG_SUCCESS,
  UPDATE_LOG_FAILURE,
  RESET_GET_LOGS,
  RESET_UPDATE_LOG,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  RESET_UPDATE_USER,
  UPDATE_ACTIVITY_SUCCESS,
  UPDATE_ACTIVITY_FAILURE,
  RESET_UPDATE_ACTIVITY,
  NEW_USER_SUCCESS,
  RESET_NEW_USER,
} from '../actions/types';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

const initialState = {
  activities: '',
  activitiesError: '',
  addActivity: '',
  addActivityError: '',
  updateActivity: '',
  updateActivityError: '',
  deleteActivity: '',
  deleteActivityError: '',
  logs: '',
  logsError: '',
  updateLog: '',
  updateLogError: '',
  updateUser: '',
  updateUserError: '',
  newUser: '',
  alert: true
}

export default (state = initialState, action) => {
  const actionHandlers = {
    // Activities statuses-------------
    [GET_ACTIVITIES_BEGIN]: {
      activities: LOADING,
      activitiesError: '',
    },
    [GET_ACTIVITIES_SUCCESS]: {
      activities: SUCCESS,
      activitiesError: '',
    },
    [GET_ACTIVITIES_FAILURE]: {
      activities: ERROR,
      activitiesError: action.error,
    },
    [ADD_ACTIVITY_SUCCESS]: {
      addActivity: SUCCESS,
      addActivityError: '',
      activity: action.activity,
    },
    [ADD_ACTIVITY_FAILURE]: {
      addActivity: ERROR,
      addActivityError: action.error,
    },
    [RESET_ADD_ACTIVITY]: {
      addActivity: '',
      addActivityError: '',
      activity: {}
    },
    [DELETE_ACTIVITY_SUCCESS]: {
      deleteActivity: SUCCESS,
      deleteActivityError: '',
    },
    [DELETE_ACTIVITY_FAILURE]: {
      deleteActivity: ERROR,
      deleteActivityError: action.error,
    },
    [UPDATE_ACTIVITY_SUCCESS]: {
      updateActivity: SUCCESS,
      updateActivityError: '',
      activity: action.activity,
      alert: action.alert
    },
    [UPDATE_ACTIVITY_FAILURE]: {
      updateActivity: ERROR,
      updateActivityError: action.error,
    },
    [RESET_UPDATE_ACTIVITY]: {
      updateActivity: '',
      updateActivityError: '',
      alert: true
    },

    // Log statuses--------------------
    [GET_ACTIVITY_LOGS_BEGIN]: {
      logs: LOADING,
      logsError: '',
    },
    [GET_ACTIVITY_LOGS_SUCCESS]: {
      logs: SUCCESS,
      logsError: '',
    },
    [GET_ACTIVITY_LOGS_FAILURE]: {
      logs: ERROR,
      logsError: action.error,
    },
    [UPDATE_LOG_SUCCESS]: {
      updateLog: SUCCESS,
      updateLogError: ''
    },
    [UPDATE_LOG_FAILURE]: {
      updateLog: ERROR,
      updateLogError: action.error
    },
    [DELETE_LOG_SUCCESS]: {
      logs: SUCCESS,
      logsError: ''
    },
    [DELETE_LOG_FAILURE]: {
      logs: ERROR,
      logsError: action.error
    },
    [FLUSH_LOGS]: {
      logs: '',
      logsError: ''
    },
    [RESET_GET_LOGS]: {
      logs: '',
      logsError: ''
    },
    [RESET_UPDATE_LOG]: {
      updateLog: '',
      updateLogError: ''
    },

    // User statuses--------------------
    [UPDATE_USER_SUCCESS]: {
      updateUser: SUCCESS,
      updateUserError: ''
    },
    [UPDATE_USER_FAILURE]: {
      updateUser: ERROR,
      updateUserError: action.error
    },
    [RESET_UPDATE_USER]: {
      updateUser: '',
      updateUserError: ''
    },
    [NEW_USER_SUCCESS]: {
      newUser: SUCCESS
    },
    [RESET_NEW_USER]: {
      newUser: ''
    },
  }
  return Object.assign({}, state, actionHandlers[action.type]);
}