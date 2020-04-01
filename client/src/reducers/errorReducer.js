import { 
  GET_ERRORS, 
  UPDATE_USER_SUCCESS,
  RESET_AUTH_ERRORS,
} from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER_SUCCESS:
      return {};

    case RESET_AUTH_ERRORS: 
      // Remove the given errors from the state
      let toReset = action.values;
      let remaining = Object.keys(state).filter(key => !toReset.includes(key));
      let nextState = {};
      remaining.forEach(key => nextState[key] = state[key]);
      return nextState;

    case GET_ERRORS:
      return action.payload;
      
    default:
      return state;
  }
}
