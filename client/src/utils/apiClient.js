import axios from 'axios';

// const ACTIVITY_URL = (activityId) => '/api/activities/' + activityId;
const LOGIN_URL = '/api/users/login';
const USER_URL = (userId) => '/api/users/' + userId;
const USER_ACTIVITIES_URL = (userId) => '/api/users/' + userId + '/activities/';
const ACTIVITIES_URL = '/api/activities/';
const USER_ACTIVITY_LOGS_URL = (userId, activityId) => '/api/users/' + userId + '/activities/' + activityId + '/logs';
const ACTIVITY_LOGS_URL = (activityId) => '/api/activities/' + activityId + '/logs/';

const apiClient = {
  // Activities
  addActivity(userId, activity) {
    return axios.post(USER_ACTIVITIES_URL(userId), activity);
  },
  deleteActivity(userId, activityId) {
    return axios.delete(USER_ACTIVITIES_URL(userId) + activityId);
  },
  getActivityLogs(userId, activityId) {
    return axios.get(USER_ACTIVITY_LOGS_URL(userId, activityId));
  },
  getUserActivities(userId) {
    return axios.get(USER_ACTIVITIES_URL(userId));
  },
  updateActivity(activityId, values) {
    return axios.put(ACTIVITIES_URL + activityId, values);
  },

  // Logs
  addLog(activityId, log) {
    return axios.post(ACTIVITY_LOGS_URL(activityId), log);
  },
  updateLog(activityId, log) {
    return axios.put(ACTIVITY_LOGS_URL(activityId) + log._id, log);
  },
  deleteLog(activityId, logId) {
    return axios.delete(ACTIVITY_LOGS_URL(activityId) + logId);
  },

  // User
  login(userData) {
    return axios.post(LOGIN_URL, userData);
  },
  updateUser(userId, data) {
    return axios.put(USER_URL(userId), data);
  },
  getUser(userId) {
    return axios.get(USER_URL(userId));
  },
}

export default apiClient;