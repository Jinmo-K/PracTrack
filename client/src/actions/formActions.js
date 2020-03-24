import {
  NEW_LOG_FORM,
  NEW_ACTIVITY_FORM,
  HIDE_FORM
} from './types';


export const openNewLogForm = (data) => (dispatch) => {
  dispatch({
    type: NEW_LOG_FORM,
    data
  });
};

export const openNewActivityForm = () => (dispatch) => {
  dispatch({
    type: NEW_ACTIVITY_FORM
  });
}

export const hideForm = () => (dispatch) => {
  dispatch({
    type: HIDE_FORM
  });
};

