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
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const goalInMs = hrToMillisec(newGoal);

  const updateGoal = (e) => {
    e.preventDefault();
    if (newGoal !== currGoal && newGoal >= 0) {
      setIsEditingGoal(false);
      updateActivity(activity._id, { goal: newGoal });
      setCurrGoal(newGoal);
    }
  }

  const onCancel = (e) => {
    e.preventDefault();
    setIsEditingGoal(false);
    setIsGoalValid(true);
    setNewGoal(currGoal || '');
  }

  return (
    <div>
      <div className='row justify-content-center mb-4 align-items-center'> 
        <div className={(activity.logs.length) ? 'col-12 col-sm text-center text-sm-left' : 'col-12 text-center'}>
          <h1 className="display-4 text-sm-break">{activity.title}</h1>
        </div>
        <div className={(activity.logs.length) ? 'col-12 col-sm text-center text-sm-left' : 'col-12 text-center'}>
          <Timer activity={activity} />
        </div>
      </div>
      <div className={(activity.logs.length) ? 'text-center text-sm-left' : 'text-center'}>
        {(activity.logs.length) 
         ? <h5>Total: {msToHrsMinSec(activity.totalDuration)}</h5>
         : null
        }
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

        <form noValidate onSubmit={updateGoal}>
          <div className='mt-3 form-group'>
            <Collapse in={isEditingGoal} collapsedHeight={0} timeout={200}>
              <Fade in={isEditingGoal} timeout={700}>
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
            {isEditingGoal
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
                    setIsEditingGoal(true)
                  }}
                >Update goal</button>
            }
          </div>
        </form>
      </div>
    </div>
  )
}

export default connect(
  null,
  { updateActivity }
)(Title);