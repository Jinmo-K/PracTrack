import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

/** 
 * Wrapper for routes requiring user auth
 */
const PrivateRoute = ({ component:Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (auth.isAuthenticated) 
      ? <Component {...props} />
      : <Redirect to="/" />
    }
  />
);

PrivateRoute.propTypes = {
  /** Component that will be rendered if user is logged in */
  component: PropTypes.elementType.isRequired,
  /** Auth store state */
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    user: PropTypes.shape({
      email: PropTypes.string,
      exp: PropTypes.number,
      iat: PropTypes.number,
      id: PropTypes.string,
      name: PropTypes.string,
      role: PropTypes.number
    }),
    loading: PropTypes.bool
  }),
  /** Props that will be passed to the Route component */
  rest: PropTypes.object
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
)(PrivateRoute);
