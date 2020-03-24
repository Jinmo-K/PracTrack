import React, { useState } from 'react';
import { connect } from 'react-redux';
// Components
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
import Timer from '../../shared/Timer';
import ProgressBar from '../../shared/ProgressBar';
// Functions
import { msToHrsMinSec, hrToMillisec } from '../../../utils/timeFunctions';
import { updateActivity } from '../../../actions/activitiesActions';


/** 
 * ============================================
 *   Section containing activity info
 * ============================================
 */
const Title = ({ activity, updateActivity }) => {
  // Reflects actual goal in db
  const [currGoal, setCurrGoal] = useState(activity.goal || '');
  const [newGoal, setNewGoal] = useState(currGoal);
  const [isGoalValid, setIsGoalValid] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const goalInMs = hrToMillisec(newGoal);

  // TODO if UPDATE_ACTIVITY_ERROR status, reset values?

  const onSubmit = (e) => {
    e.preventDefault();
    if (newGoal !== currGoal && newGoal >= 0) {
      setIsEditing(false);
      updateActivity(activity._id, { goal: newGoal });
      setCurrGoal(newGoal);
    }
  }

  const onCancel = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setIsGoalValid(true);
    setNewGoal(currGoal || '');
  }

  return (
    <div>
      <div className='d-inline-flex'>
        <div className='col-sm-8'>
          <h1 className="display-4 mb-4">{activity.title}</h1>
        </div>
        <div className='col-sm-4'>
          <Timer activity={activity} />
        </div>
      </div>

      <h5>Total: {msToHrsMinSec(activity.totalDuration)}</h5>
      {(currGoal || newGoal)
        ? <React.Fragment>
            <ProgressBar current={activity.totalDuration} goal={goalInMs} showText={true} />
            {(activity.totalDuration < goalInMs)
              ? <h6>{msToHrsMinSec(goalInMs - activity.totalDuration)} remaining until goal of {newGoal} hrs!</h6>
              : <h6>Goal of {newGoal} hrs completed!</h6>
            }
          </React.Fragment>
        : <div>You haven't set a goal yet.</div>
      }

      <form noValidate onSubmit={onSubmit}>
        <div className='mt-3 form-group'>
          <Collapse in={isEditing} collapsedHeight={0} timeout={200}>
            <Fade in={isEditing} timeout={700}>
              <div className='mb-3'>
                <TextField
                  error={!isGoalValid}
                  variant="outlined"
                  type='number'
                  style={{ 'maxWidth': '220px' }}
                  label={isGoalValid ? 'Goal' : 'Cannot be negative'}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>Hr</InputAdornment>
                  }}
                  inputProps={{ min: "0" }}
                  value={newGoal}
                  onChange={(e) => {
                    e.target.value < 0 ? setIsGoalValid(false) : setIsGoalValid(true);
                    setNewGoal(e.target.valueAsNumber || '');
                  }}
                />
              </div>
            </Fade>
          </Collapse>
          {isEditing
            ? <div>
                <button className='btn btn-lg' onClick={onCancel}>Cancel</button>
                <button className='btn btn-info btn-lg'
                  type='submit'
                  disabled={currGoal === newGoal || !isGoalValid}
                >Set goal</button>
              </div>
            : 
              <button className='btn btn-info btn-lg'
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true)
                }}
              >Update goal</button>
          }
        </div>
      </form>
    </div>
  )
}

export default connect(
  null,
  { updateActivity }
)(Title);