import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextField from '@material-ui/core/TextField';
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
        <form className='col-sm-10 col-md-7 col-lg-5 p-2 p-sm-5 mt-sm-2' noValidate onSubmit={this.onSubmit}>
          <h2 className='sr-only'>Login form</h2>
          <div className='login-header'>
            <h2>
              <img className="pb-2" src="../../../images/logo-md.png" alt="PracTrack logo"></img> 
              &ensp;Login to continue
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
