import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../../actions/authActions";

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

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
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
    const  errors  = this.state.errors;

    return (
      <div className='row justify-content-center'>
          <div className='login'>
            <form className='pt-5 mt-5 shadow' noValidate onSubmit={this.onSubmit}>
              <h2 className='sr-only'>Login form</h2>
              <div className='login-logo'>
                <h1>Sign up</h1>
                <i className='icon ion-ios-navigate'></i>
              </div>

              <div className='form-group'>
                <input
                    onChange={this.onChange}
                    value={this.state.name}
                    error={errors.name}
                    className='form-control' 
                    id="name"
                    type="text"
                    placeholder='Name'
                />
                <span className="error-text">{errors.name}</span>
              </div>

              <div className='form-group'>
                <input 
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  className='form-control' 
                  type='email' 
                  id='email'
                  placeholder='Email' 
                />
                <span className="error-text">{errors.email}</span>
              </div>
              <div className='form-group'>
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  className='form-control' 
                  id="password"
                  type="password"
                  placeholder='Password'
                />
                <span className="error-text">{errors.password}</span>
              </div>
              <div className='form-group'>
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  className='form-control'
                  id="password2"
                  type="password"
                  placeholder='Confirm password'
                />
                <span className="error-text">{errors.password2}</span>
              </div>
              <div className='form-group'>
                <button className='btn btn-primary btn-block' type='submit'>Sign up</button>
              </div>
              <Link className='forgot' to='/'>ALREADY HAVE AN ACCOUNT? <u>CLICK HERE</u> TO LOGIN</Link>
            </form>
          </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(
  mapStateToProps,
  { registerUser }
)(Register));
