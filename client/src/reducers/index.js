import { combineReducers } from "redux";
import authReducer from "./authReducer";
import activitiesReducer from './activitiesReducer';
import logsReducer from './logsReducer';
import errorReducer from "./errorReducer";
import statusReducer from './statusReducer';
import formReducer from './formReducer';

export default combineReducers({
  auth: authReducer,
  activities: activitiesReducer,
  logs: logsReducer,
  errors: errorReducer,
  status: statusReducer,
  form: formReducer,
});

