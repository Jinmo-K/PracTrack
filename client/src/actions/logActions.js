import apiClient from '../utils/apiClient';
import {
  ADD_LOG_SUCCESS,
  ADD_LOG_FAILURE,
  UPDATE_LOG_SUCCESS,
  UPDATE_LOG_FAILURE,
  DELETE_LOG_SUCCESS,
  DELETE_LOG_FAILURE,
  GET_ACTIVITY_LOGS_BEGIN,
  GET_ACTIVITY_LOGS_SUCCESS,
  GET_ACTIVITY_LOGS_FAILURE,
  FLUSH_LOGS,
  RESET_GET_LOGS,
  RESET_UPDATE_LOG
} from './types';


/*
* ==========================================
*   Action creators
* ==========================================
*/

// POST log
export const addLogSuccess = (log) => ({
  type: ADD_LOG_SUCCESS,
  log,
});
export const addLogFailure = (error) => ({
  type: ADD_LOG_FAILURE,
  error,
});

// UPDATE log
export const updateLogSuccess = (log) => ({
  type: UPDATE_LOG_SUCCESS,
  log
})
export const updateLogFailure = (error) => ({
  type: UPDATE_LOG_FAILURE,
  error
})

// DELETE log
export const deleteLogSuccess = (log) => ({
  type: DELETE_LOG_SUCCESS,
  log
});
export const deleteLogFailure = (error) => ({
  type: DELETE_LOG_FAILURE,
  error
})

// GET logs 
export const getActivityLogsBegin = () => ({
  type: GET_ACTIVITY_LOGS_BEGIN,
});
export const getActivityLogsSuccess = (logs) => ({
  type: GET_ACTIVITY_LOGS_SUCCESS,
  logs,
});
export const getActivityLogsFailure = (error) => ({
  type: GET_ACTIVITY_LOGS_FAILURE,
  error,
});


/*
* ==========================================
*   Thunk middleware
* ==========================================
*/

// POST a log to an activity
export function addLog(activityId, log) {
  return (dispatch) => {
    apiClient.addLog(activityId, log)
      .then(res => {
        dispatch(addLogSuccess(res.data));
      })
      .catch(err => {
        dispatch(addLogFailure('something went wrong. Please try again.'));
      });
  };
};

// UPDATE a log of an activity
export const updateLog = (newLog) => (dispatch) => {
  apiClient.updateLog(newLog.activityId, newLog)
    .then(res => {
      dispatch(updateLogSuccess(res.data));
    })
    .catch(err => {
      dispatch(updateLogFailure('something went wrong. Please try again.'));
    })
}

// DELETE a log of an activity
export const deleteLog = (log) => (dispatch) => {
  apiClient.deleteLog(log.activityId, log._id)
    .then(() => {
      dispatch(deleteLogSuccess(log));
    })
    .catch(err => {
      dispatch(deleteLogFailure('something went wrong. Please try again.'));
    });
}

// GET an activity's logs
export function getActivityLogs(userId, activityId) {
  return (dispatch) => {
    dispatch(getActivityLogsBegin());
    apiClient.getActivityLogs(userId, activityId)
      .then(res => {
        dispatch(getActivityLogsSuccess(res.data));
      })
      .catch(err => {
        dispatch(getActivityLogsFailure('something went wrong. Please try again.'));
      });
  }
};

// Reset the logs state to []
export const flushLogs = () => (dispatch) => {
  dispatch({
    type: FLUSH_LOGS
  })
};

export const resetGetLogs = () => (dispatch) => {
  dispatch({
    type: RESET_GET_LOGS
  })
}

export const resetUpdateLog = () => (dispatch) => {
  dispatch({
    type: RESET_UPDATE_LOG
  })
}