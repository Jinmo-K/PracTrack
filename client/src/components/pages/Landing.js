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
      <div className='row justify-content-center login mx-auto'>
        <form className='col-sm-10 col-md-7 col-lg-5 p-2 p-sm-5 mt-sm-2' noValidate onSubmit={this.onSubmit}>
          <h2 className='sr-only'>Login form</h2>
          <div className='login-header'>
            <h1>Login to continue</h1>
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
            </span>
          </div>
          <div className='form-group'>
            <button className='btn btn-block' type='submit'>Login</button>
          </div>
          <Link className='forgot' to='/register'>DON'T HAVE AN ACCOUNT? <u>CLICK HERE</u> TO SIGN UP</Link>
        </form>
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
