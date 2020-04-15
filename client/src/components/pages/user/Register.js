import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextField from '@material-ui/core/TextField';
import { connect } from "react-redux";
import { registerUser, resetAuthErrors } from "../../../actions/authActions";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
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
    this.props.resetAuthErrors(['name', 'email', 'password', 'password2']);
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

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const errors = this.state.errors;

    return (
      <div className='row justify-content-center login mx-auto'>
        <form className='col-sm-10 col-md-7 col-lg-5 p-2 mt-sm-2 pt-5' noValidate onSubmit={this.onSubmit}>
          <h2 className='sr-only'>Login form</h2>
          <div className='login-header' style={{marginRight: "42px"}}>
            <h2>
              <img className="pb-2" src="../../../images/logo-md.png" alt="PracTrack logo"></img>
              &nbsp;Sign up
            </h2>
          </div>

          <div className='form-group'>
            <TextField 
              fullWidth
              label='Name'
              id="name"
              variant='outlined'
              error={!!errors.name}
              helperText={errors.name}
              value={this.state.name}
              onChange={this.onChange}
              onFocus={this.onFocus}
            />
          </div>

          <div className='form-group'>
            <TextField 
              fullWidth
              label='Email'
              id='email'
              type='email'
              variant='outlined'
              error={!!errors.email}
              helperText={errors.email}
              value={this.state.email}
              onChange={this.onChange}
              onFocus={this.onFocus}
            />
          </div>
          <div className='form-group'>
            <TextField 
              fullWidth
              label='Password'
              id='password'
              type='password'
              variant='outlined'
              error={!!errors.password}
              helperText={errors.password}
              value={this.state.password}
              onChange={this.onChange}
              onFocus={this.onFocus}
            />
          </div>
          <div className='form-group'>
            <TextField 
              fullWidth
              label='Confirm password'
              id='password2'
              type='password'
              variant='outlined'
              error={!!errors.password2}
              helperText={errors.password2}
              value={this.state.password2}
              onChange={this.onChange}
              onFocus={this.onFocus}
            />
          </div>
          <div className='form-group'>
            <button className='btn btn-block' type='submit' style={{fontWeight: 500}}>Sign up</button>
          </div>
          <Link className='forgot' to='/'>ALREADY HAVE AN ACCOUNT? <u>CLICK HERE</u> TO LOGIN</Link>
        </form>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  resetAuthErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(
  mapStateToProps,
  { registerUser, resetAuthErrors }
)(Register));
