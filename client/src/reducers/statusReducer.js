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
  EMPTY_LOGS,
  DELETE_LOG_SUCCESS,
  DELETE_LOG_FAILURE,
  UPDATE_LOG_SUCCESS,
  UPDATE_LOG_FAILURE,
  RESET_GET_LOGS,
  RESET_UPDATE_LOG,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  RESET_UPDATE_USER,
} from '../actions/types';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

const initialState = {
  activities: '',
  activitiesError: '',
  addActivity: '',
  addActivityError: '',
  activity: {},
  deleteActivity: '',
  deleteActivityError: '',
  logs: '',
  logsError: '',
  updateLog: '',
  updateLogError: '',
  updateUser: '',
  updateUserError: '',
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
      activity: action.activity,
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
    [EMPTY_LOGS]: {
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
    }
  }
  return Object.assign({}, state, actionHandlers[action.type]);
}