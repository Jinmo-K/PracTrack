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
 *   New activity form, displayed in AppModal
 */
const ActivityForm = ({ hideForm, addActivity, userId, activities }) => {
  const { value: name, bindProps: bindName } = useInput('');
  const [nameError, setNameError] = useState('');
  const [goal, setGoal] = useState('');
  const [goalError, setGoalError] = useState('');

  /**
   * Validates name and sets name error if input is empty or activity name already exists
   * @return {boolean}  True if name is valid
   */
  const validateName = () => {
    let error = '';
    if (!name) {
      error = 'Activity must have a name';
    }
    else if (activities.some(activity => activity.title.toLowerCase() === name.toLowerCase())) {
      error = 'Activities must have unique names';
    }
    setNameError(error);
    return !error;
  }

  /**
   * Handles submit button click. If name is valid, dispatches functions to add 
   * the new activity and close the form modal.
   */ 
  const onSubmit = (e) => {
    e.preventDefault();
    let valid = validateName();
    if (valid) {
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
        <div id='activity-form' className='p-0 p-sm-2 justify-content-center container'>
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
                error={!!nameError}
                helperText={nameError}
                onFocus={() => setNameError('')}
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
        <Button id='activity-form-cancel-btn' color="secondary" onClick={hideForm}>Cancel</Button>{' '}
        <Button id='activity-form-submit-btn' color="info" onClick={onSubmit} disabled={!!goalError}>Submit</Button>
      </ModalFooter>
    </div>
  );
}

ActivityForm.propTypes = {
  userId: PropTypes.string.isRequired,
  hideForm: PropTypes.func.isRequired,
  addActivity: PropTypes.func.isRequired,
  activities: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
  activities: state.activities,
});

const mapDispatchToProps = {
  hideForm,
  addActivity,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityForm);

export { ActivityForm };