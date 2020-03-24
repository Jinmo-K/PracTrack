import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// Functions
import { loginUser } from "../../actions/authActions";


/** 
 * ============================================
 *   Public homepage
 * ============================================
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
    // If logged in and user navigates to Login page, should redirect them to dashboard
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

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
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
      <div className='row justify-content-center'>
          <div className='login'>
            <form className='pt-5 mt-5 shadow' noValidate onSubmit={this.onSubmit}>
              <h2 className='sr-only'>Login form</h2>
              <div className='login-logo'>
                <h1>Login to continue</h1>
                <i className='icon ion-ios-navigate'></i>
              </div>
              <div className='form-group'>
                <input 
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  className='form-control' 
                  type='email' 
                  name='email' 
                  id='email'
                  placeholder='Email' 
                />
                <span className="error-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className='form-group'>
                <input 
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  className='form-control' 
                  id='password'
                  type='password' 
                  name='password' 
                  placeholder='Password' 
                />
                <span className="error-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className='form-group'>
                <button className='btn btn-primary btn-block' type='submit'>Login</button>
              </div>
              <Link className='forgot' to='/register'>DON'T HAVE AN ACCOUNT? <u>CLICK HERE</u> TO SIGN UP</Link>
            </form>
          </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Landing);
