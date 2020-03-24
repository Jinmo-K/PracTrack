import {
  NEW_LOG_FORM,
  NEW_ACTIVITY_FORM,
  HIDE_FORM
} from '../actions/types';

const initialState = {
  formVisible: false,
  formType: '',
  data: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NEW_LOG_FORM:
      return {
        formVisible: true,
        formType: 'NEW_LOG',
        data: action.data
      };

    case NEW_ACTIVITY_FORM:
      return {
        formVisible: true,
        formType: 'NEW_ACTIVITY',
        data: {}
      };

    case HIDE_FORM:
      return {
        formVisible: false,
        formType: '',
        data: {}
      };

    default:
      return state;
  }
};