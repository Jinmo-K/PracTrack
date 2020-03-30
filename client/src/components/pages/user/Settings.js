import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Components
import TextField from '@material-ui/core/TextField';
// Functions
import { useInput } from '../../../hooks/useInput';
import { updateUser } from '../../../actions/authActions';


/** 
 * ============================================
 *   Edit user information 
 * ============================================
 */
const Settings = ({ user, errors, updateUser }) => {
  const {value:name, bindProps:bindName} = useInput(user.name);
  const {value:email, bindProps:bindEmail} = useInput(user.email);
  const {value:currPw, bindProps:bindCurrPw} = useInput('');
  const {value:newPw, bindProps:bindNewPw} = useInput('');
  const {value:newPw2, bindProps:bindNewPw2} = useInput('');

  const onSubmit = (e) => {
    e.preventDefault();
  }


  return (
    <div className='row mt-3 justify-content-center login mx-auto align-items-center'>
      <form className='col-sm-10 col-md-7 col-lg-5 p-2 p-sm-5 mt-sm-2' noValidate onSubmit={onSubmit}>
        <div className='app-font mb-5'>
          <h1>User settings</h1>
        </div>

        {/* Name */}
        <div className='form-group'>
          <TextField 
            fullWidth
            label='Name'
            variant='outlined'
            error={errors.name}
            {...bindName} 
          />
          <span className="error-text">
            {errors.name}
          </span>
        </div>

        {/* Email */}
        <div className='form-group'>
          <TextField 
            fullWidth
            label='Email'
            variant='outlined'
            type='email'
            error={errors.email}
            {...bindEmail} 
          />
          <span className="error-text">
            {errors.email}
          </span>
        </div>

        <h5 className='mt-5'>Change password</h5>
        {/* Current password */}
        <div className='form-group'>
          <TextField 
            fullWidth
            label='Current password'
            variant='outlined'
            type='password'
            error={errors.currentPassword}
            {...bindCurrPw} 
          />
          <span className="error-text">
            {errors.currentPassword}
          </span>
        </div>

        {/* New password */}
        <div className='form-group'>
          <TextField 
            fullWidth
            label='New password'
            variant='outlined'
            type='password'
            error={errors.password}
            {...bindNewPw} 
          />
          <span className="error-text">
            {errors.password}
          </span>
        </div>
        <div className='form-group'>
          <TextField 
            fullWidth
            label='Confirm new password'
            variant='outlined'
            type='password'
            error={errors.password2}
            {...bindNewPw2} 
          />
          <span className="error-text">
            {errors.password2}
          </span>
        </div>
        <div className='form-group'>
          <button className='btn btn-block' type='submit'>Save</button>
        </div>
      </form>
    </div>
  );
};


Settings.propTypes = {
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  errors: state.errors,
});

export default connect(
  mapStateToProps,
  { updateUser }
)(Settings);