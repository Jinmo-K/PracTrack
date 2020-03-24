import apiClient from '../utils/apiClient';
import {
  ADD_ACTIVITY_SUCCESS,
  ADD_ACTIVITY_FAILURE,
  DELETE_ACTIVITY_SUCCESS,
  DELETE_ACTIVITY_FAILURE,
  GET_ACTIVITIES_SUCCESS,
  GET_ACTIVITIES_FAILURE,
  GET_ACTIVITIES_BEGIN,
  UPDATE_ACTIVITY_SUCCESS,
  UPDATE_ACTIVITY_FAILURE,
  RESET_ADD_ACTIVITY,
} from './types';

/*
* ==========================================
*   Action creators
* ==========================================
*/

// POST activity 
export const addActivitySuccess = (activity) => ({
  type: ADD_ACTIVITY_SUCCESS,
  activity,
});
export const addActivityFailure = (error) => ({
  type: ADD_ACTIVITY_FAILURE,
  error,
});

// UPDATE activity 
export const updateActivitySuccess = (activity) => ({
  type: UPDATE_ACTIVITY_SUCCESS,
  activity,
});
export const updateActivityFailure = (error) => ({
  type: UPDATE_ACTIVITY_FAILURE,
  error,
});

// DELETE activity 
export const deleteActivitySuccess = (activityId) => ({
  type: DELETE_ACTIVITY_SUCCESS,
  activityId,
});
export const deleteActivityFailure = (error) => ({
  type: DELETE_ACTIVITY_FAILURE,
  error,
});

// GET activities 
export const getActivitiesBegin = () => ({
  type: GET_ACTIVITIES_BEGIN,
});
export const getActivitiesSuccess = (activities) => ({
  type: GET_ACTIVITIES_SUCCESS,
  activities,
});
export const getActivitiesFailure = (error) => ({
  type: GET_ACTIVITIES_FAILURE,
  error,
});


/*
* ==========================================
*   Thunk middleware
* ==========================================
*/

// GET activities
export function getActivities(userId) {
  return (dispatch) => {
    dispatch(getActivitiesBegin());
    apiClient.getUserActivities(userId)
      .then(res => {
        dispatch(getActivitiesSuccess(res.data));
      })
      .catch(err => {
        dispatch(getActivitiesFailure('something went wrong. Please try again.'));
      });
  };
};

// POST activity
export function addActivity(userId, activity) {
  return (dispatch) => {
    apiClient.addActivity(userId, activity)
      .then(res => {
        dispatch(addActivitySuccess(res.data));
      })
      .catch(err => {
        //Mongo duplicate key error
        if (err.response.data.errorCode === 11000) {
          dispatch(addActivityFailure('activities must have unique names.'))
        }
        else {
          dispatch(addActivityFailure('something went wrong. Please try again.'));
        }
      });
  };
};
export const resetAddActivityStatus = () => (dispatch) => {
  dispatch({
    type: RESET_ADD_ACTIVITY
  })
};

// DELETE activity
export function deleteActivity(userId, activityId) {
  return (dispatch) => {
    apiClient.deleteActivity(userId, activityId)
      .then(() => {
        dispatch(deleteActivitySuccess(activityId));
      })
      .catch(err => {
        dispatch(deleteActivityFailure('something went wrong. Please try again.'));
      });
  };
};
// UPDATE activity
export function updateActivity(activityId, values) {
  return (dispatch) => {
    apiClient.updateActivity(activityId, values)
      .then(res => {
        dispatch(updateActivitySuccess(res.data))
      })
      .catch(err => {
        dispatch(updateActivityFailure('something went wrong. Please try again.'))
      });
  }
};
