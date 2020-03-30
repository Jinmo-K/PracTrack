import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Components
import { ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
// Functions
import { useInput } from '../../hooks/useInput';
import { hideForm } from '../../actions/formActions';
import { addActivity } from '../../actions/activitiesActions';


/** 
 * ============================================
 *   New activity form, displayed in AppModal
 * ============================================
 */
const ActivityForm = ({ hideForm, addActivity, userId }) => {
  const { value: name, bindProps: bindName } = useInput('');
  const [goal, setGoal] = useState('');
  const [goalError, setGoalError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!goalError) {
      const newActivity = {
        title: name,
        goal: goal
      };
      addActivity(userId, newActivity);
      hideForm();
    }
  };

  return (
    <div>
      <ModalHeader toggle={hideForm}>
        Create a new activity
      </ModalHeader>
      <ModalBody>
        <div className='p-0 p-sm-2 justify-content-center container'>
          {/* Name */}
          <div className='form-group row mb-1 mb-sm-3 align-items-center'>
            <label className='col-12 col-sm-2 text-left h1 lead text-sm-right' htmlFor='inputName'>
              Name
            </label>
            <div className='col-12 col-sm-10'>
              <TextField
                id='inputName'
                variant="outlined"
                size='small'
                fullWidth
                {...bindName}
              />
            </div>
          </div>

          {/* Goal */}
          <div className='form-group row mb-1 mb-sm-3 align-items-center'>
            <label className='col-12 col-sm-2 text-left h1 lead text-sm-right' htmlFor='inputGoal'>
              Goal
            </label>
            <div className='col-12 col-sm-10'>
              <TextField
                id='inputGoal'
                variant="outlined"
                size='small'
                fullWidth
                type='number'
                error={!!goalError}
                helperText={goalError}
                InputProps={{
                  inputProps: { min: 0 }
                }}
                value={goal}
                onChange={(e) => {
                  (e.target.value < 0) ? setGoalError('Goal cannot be negative') : setGoalError('');
                  setGoal(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={hideForm}>Cancel</Button>{' '}
        <Button color="info" onClick={onSubmit} disabled={!!goalError}>Submit</Button>
      </ModalFooter>
    </div>
  );
}

ActivityForm.propTypes = {
  userId: PropTypes.string.isRequired,
  hideForm: PropTypes.func.isRequired,
  addActivity: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
});

const mapDispatchToProps = {
  hideForm,
  addActivity,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityForm);