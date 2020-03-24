import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Components
import TextField from '@material-ui/core/TextField';
// Functions
import { useInput } from '../../../hooks/useInput';


/** 
 * ============================================
 *   Edit user information 
 * ============================================
 */
const Settings = ({ user }) => {
  console.log(user)
  const {value:name, bindProps:bindName} = useInput('');


  return (
      <div className='row justify-content-center'>
        <div className='login'>
          <form className='pt-5 mt-5' noValidate >
            <h2 className='sr-only'>Login form</h2>
            <div className='login-logo'>
              <h1>Sign up</h1>
              <i className='icon ion-ios-navigate'></i>
            </div>

            <div className='form-group'>
              <TextField 
                label='Name'
                variant='outlined'
                {...bindName} 
              />
              <input
                  className='form-control' 
                  id="name"
                  type="text"
                  {...bindName}

              />
              <span className="error-text">errors.name</span>
            </div>

            <div className='form-group'>
              <input 
              //   onChange={this.onChange}
              //   value={this.state.email}
              //   error={errors.email}
              //   className='form-control' 
              //   type='email' 
              //   id='email'
                placeholder='Email' 
              />
              <span className="error-text">errors.email</span>
            </div>
            <div className='form-group'>
              <input
              //   onChange={this.onChange}
              //   value={this.state.password}
              //   error={errors.password}
              //   className='form-control' 
              //   id="password"
              //   type="password"
                placeholder='Password'
              />
              <span className="error-text">errors.password</span>
            </div>
            <div className='form-group'>
              <input
              //   onChange={this.onChange}
              //   value={this.state.password2}
              //   error={errors.password2}
              //   className='form-control'
              //   id="password2"
              //   type="password"
                placeholder='Confirm password'
              />
              <span className="error-text">errors.password2</span>
            </div>
            <div className='form-group'>
              <button className='btn btn-primary btn-block' type='submit'>Sign up</button>
            </div>
          </form>
        </div>
    </div>
  );
};


Settings.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(
    mapStateToProps
)(Settings)