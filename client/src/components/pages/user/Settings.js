import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Components
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
// Functions
import { useInput } from '../../../hooks/useInput';
import { updateUser, resetAuthErrors, resetUpdateUser } from '../../../actions/authActions';


/** 
 * ============================================
 *   Edit user information 
 * ============================================
 */
const Settings = ({ user, errors, updateUser, resetAuthErrors, updateUserStatus, resetUpdateUser }) => {
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

  const toggleChangePw = (e) => {
    e.preventDefault();
    if (isChangingPw) {
      setPw('');
      setPw2('');
    }
    setIsChangingPw(!isChangingPw);
  }

  useEffect(() => {
    if ((name !== user.name) || (email !== user.email) || (password && password2)) {
      setDirtyFlag(true);
    }
    else {
      setDirtyFlag(false);
    }
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
  }, [user, name, email, currPassword, password, password2, updateUserStatus, errors])

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
            error={!!errors.name}
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
            error={!!errors.email}
            {...bindEmail} 
          />
          <span className="error-text">
            {errors.email}
          </span>
        </div>

        {/* Current password */}
        <div className='form-group'>
          <TextField 
            fullWidth
            label='Password'
            variant='outlined'
            type='password'
            error={!!errors.currPassword}
            {...bindCurrPw} 
          />
          <span className="error-text">
            {errors.currPassword}
          </span>
        </div>

        {/* Change password button */}
        <button onClick={toggleChangePw} 
                type='button'
                className="btn btn-link pt-0 mb-2 forgot"
                style={{fontSize: '16px'}}
        >
          <u>{isChangingPw ? 'Cancel' : 'Change password'}</u>
        </button>

        <Collapse in={isChangingPw} collapsedHeight={0} timeout={200}>
          <Fade in={isChangingPw} timeout={400}>
            <div>
              {/* New password */}
              <div className='form-group'>
                <TextField 
                  fullWidth
                  label='New password'
                  variant='outlined'
                  type='password'
                  error={!!errors.password}
                  {...bindNewPw} 
                />
                <span className="error-text">
                  {errors.password}
                </span>
              </div>
              {/* Confirm new password */}
              <div className='form-group'>
                <TextField 
                  fullWidth
                  label='Confirm new password'
                  variant='outlined'
                  type='password'
                  error={!!errors.password2}
                  {...bindNewPw2} 
                />
                <span className="error-text">
                  {errors.password2}
                </span>
              </div>
            </div>
          </Fade>
        </Collapse>

        <div className='form-group'>
          <button className='btn btn-block' type='submit' disabled={!dirtyFlag}>Save</button>
        </div>
      </form>
    </div>
  );
};


Settings.propTypes = {
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  resetAuthErrors: PropTypes.func.isRequired,
  updateUserStatus: PropTypes.string.isRequired,
  resetUpdateUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  errors: state.errors,
  updateUserStatus: state.status.updateUser,
});

const mapDispatchToProps = {
  updateUser,
  resetAuthErrors,
  resetUpdateUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);