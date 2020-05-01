import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextField from '@material-ui/core/TextField';
// Functions
import { loginUser, resetAuthErrors } from "../../actions/authActions";

/** 
 *   Public homepage
 */
class Landing extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  componentWillUnmount() {
    this.props.resetAuthErrors(['email', 'password']);
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onFocus = e => {
    this.setState({ 
      errors: {...this.state.errors, [e.target.id]: ''}
    });
  };

  onSubmit = e => {
    e.preventDefault();
    
    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  render() {
    const { errors } = this.state;
    return (
      <div className='row justify-content-center login mx-auto'>
        <form className='col-sm-10 col-md-7 col-lg-5 p-2 pt-sm-5' noValidate onSubmit={this.onSubmit}>
          <h2 className='sr-only'>Login form</h2>
          <div className='form-header login-header'>
            <h2>
              <img className="form-logo" src="../../../images/logo-md.png" alt="PracTrack logo"></img> 
              Login to continue
            </h2>
          </div>
          <div className='form-group'>
            <TextField 
              fullWidth
              id='email'
              label='Email'
              variant='outlined'
              error={!!errors.email}
              helperText={errors.email}
              value={this.state.email}
              onFocus={this.onFocus}
              type='email'
              onChange={this.onChange}
            />
          </div>
          <div className='form-group'>
            <TextField 
              fullWidth
              label='Password'
              id="password"
              variant='outlined'
              type='password'
              error={!!errors.password}
              helperText={errors.password}
              value={this.state.password}
              onFocus={this.onFocus}
              onChange={this.onChange}
            />
          </div>
          <div className='form-group'>
            <button className='btn btn-block' type='submit' style={{fontWeight: 500}}>Login</button>
          </div>
          <Link className='forgot' to='/register'>DON'T HAVE AN ACCOUNT? <u>CLICK HERE</u> TO SIGN UP</Link>
        </form>
      </div>
    );
  }
}

Landing.propTypes = {
  /** Auth store state */
  auth: PropTypes.object.isRequired,
  /** Dispatches action to login a user */
  loginUser: PropTypes.func.isRequired,
  /** Dispatches action to reset auth errors */
  resetAuthErrors: PropTypes.func.isRequired,
  /** Errors store state for auth-related errors */
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser, resetAuthErrors }
)(Landing);

export { Landing };
