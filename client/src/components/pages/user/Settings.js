import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Components
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
// Functions
import { useInput } from '../../../hooks/useInput';
import { updateUser, resetAuthErrors } from '../../../actions/authActions';


/** 
 *   Page where users can edit account related details
 */
const Settings = ({ user, errors, updateUser, resetAuthErrors, updateUserStatus }) => {
  const {value:name, bindProps:bindName, setValue:setName} = useInput(user.name);
  const {value:email, bindProps:bindEmail, setValue:setEmail} = useInput(user.email);
  const {value:currPassword, bindProps:bindCurrPw, setValue: setCurrPw} = useInput('');
  const {value:password, bindProps:bindNewPw, setValue:setPw} = useInput('');
  const {value:password2, bindProps:bindNewPw2, setValue:setPw2} = useInput('');
  const [isChangingPw, setIsChangingPw] = useState(false);
  const [dirtyFlag, setDirtyFlag] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    let updateValues = { currPassword };
    if (name !== user.name)   updateValues.name = name;
    if (email !== user.email) updateValues.email = email;
    if (password) updateValues.password = password;
    if (password2) updateValues.password2 = password2;

    updateUser(user.id, updateValues)
  }

  /** For hiding/showing new password fields  */
  const toggleChangePw = () => {
    if (isChangingPw) {
      setPw('');
      setPw2('');
    }
    setIsChangingPw(!isChangingPw);
  }

  // Check for changed values to enable submit button
  useEffect(() => {
    if ((name !== user.name) || (email !== user.email) || (password && password2)) {
      setDirtyFlag(true);
    }
    else {
      setDirtyFlag(false);
    }
  }, [user, name, email, password, password2])

  // Resets the form using newly updated values. On unmount, resets all auth-related errors
  useEffect(() => {
    if (updateUserStatus === 'SUCCESS') {
      setName(user.name);
      setEmail(user.email);
      setCurrPw('');
      setPw('');
      setPw2('');
      setIsChangingPw(false);
    }
    return () => {
      if (Object.keys(errors).length) {
        resetAuthErrors(['name', 'email', 'currPassword', 'password', 'password2'])
      }
    }
  }, [user, updateUserStatus, errors, resetAuthErrors, setCurrPw, setEmail, setName, setPw, setPw2])

  return (
    <div className='row mt-3 justify-content-center login mx-auto align-items-center'>
      <form className='col-sm-10 col-md-7 col-lg-5 p-2 p-sm-5 mt-sm-2' noValidate onSubmit={onSubmit}>
        <div className='form-header'>
          <h2>User settings</h2>
        </div>

        {/* Name */}
        <div className='form-group'>
          <TextField 
            id='name'
            fullWidth
            label='Name'
            variant='outlined'
            error={!!errors.name}
            {...bindName} 
          />
          <span id='name-error' className="error-text">
            {errors.name}
          </span>
        </div>

        {/* Email */}
        <div className='form-group'>
          <TextField 
            id='email'
            fullWidth
            label='Email'
            variant='outlined'
            type='email'
            error={!!errors.email}
            {...bindEmail} 
          />
          <span id='email-error' className="error-text">
            {errors.email}
          </span>
        </div>

        {/* Current password */}
        <div className='form-group'>
          <TextField 
            id='pw'
            fullWidth
            label='Password'
            variant='outlined'
            type='password'
            error={!!errors.currPassword}
            {...bindCurrPw} 
          />
          <span id='pw-error' className="error-text">
            {errors.currPassword}
          </span>
        </div>

        {/* Change password button */}
        <button onClick={toggleChangePw} 
                id='change-pw-btn'
                type='button'
                className="btn btn-link pt-0 mb-2 forgot"
                style={{fontSize: '16px'}}
        >
          <u>{isChangingPw ? 'Cancel' : 'Change password'}</u>
        </button>

        <Collapse id='collapse' in={isChangingPw} collapsedHeight={0} timeout={200}>
          <Fade id='fade' in={isChangingPw} timeout={400}>
            <div>
              {/* New password */}
              <div className='form-group'>
                <TextField 
                  id='new-pw'
                  fullWidth
                  label='New password'
                  variant='outlined'
                  type='password'
                  error={!!errors.password}
                  {...bindNewPw} 
                />
                <span id='new-pw-error' className="error-text">
                  {errors.password}
                </span>
              </div>
              {/* Confirm new password */}
              <div className='form-group'>
                <TextField 
                  id='confirm-pw'
                  fullWidth
                  label='Confirm new password'
                  variant='outlined'
                  type='password'
                  error={!!errors.password2}
                  {...bindNewPw2} 
                />
                <span id='confirm-pw-error' className="error-text">
                  {errors.password2}
                </span>
              </div>
            </div>
          </Fade>
        </Collapse>

        <div className='form-group'>
          <button 
            className='btn btn-block' 
            type='submit' 
            disabled={!dirtyFlag}
            style={{fontWeight: 500}}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};


Settings.propTypes = {
  /** User object held in auth store state */
  user: PropTypes.object.isRequired,
  /** Auth-related errors store state */
  errors: PropTypes.object.isRequired,
  /** Dispatch function for updating a user with the given values */
  updateUser: PropTypes.func.isRequired,
  /** Dispatches action to reset auth errors */
  resetAuthErrors: PropTypes.func.isRequired,
  /** Indicates whether updating user has succeeded */
  updateUserStatus: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  errors: state.errors,
  updateUserStatus: state.status.updateUser,
});

const mapDispatchToProps = {
  updateUser,
  resetAuthErrors,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

export { Settings };