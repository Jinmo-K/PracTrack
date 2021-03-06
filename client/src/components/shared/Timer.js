import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { openNewLogForm } from '../../actions/formActions';
import { updateActivity } from '../../actions/activitiesActions';
import { msToStopwatch } from '../../utils/timeFunctions';

/**
 * The stopwatch component 
 */
const Timer = ({ activity:nextActivity, openNewLogForm, updateActivity }) => {
  const [activity, setActivity] = useState({...nextActivity});
  // If an activity is active, calculate duration since it started
  const initialValue = activity.active ? Date.now() - Date.parse(activity.start) : 0;
  const [duration, setDuration] = useState(initialValue);
  const [isActive, setIsActive] = useState((initialValue > 0) ? true : false);
  const [startTime, setStartTime] = useState((initialValue > 0) ? (Date.now() - initialValue) : undefined);

  // Start the timer and set activity as active in the db
  const start = () => {
    const currTime = Date.now();
    setStartTime(currTime);
    updateActivity(activity._id, { active: true, start: currTime });
    setIsActive(true);
  };

  const stop = () => {
    let endTime = Date.now();
    let log_data = {
      activity,
      startTime,
      endTime,
      duration: endTime - startTime
    };
    setIsActive(false);
    updateActivity(activity._id, { active: false });
    setDuration(0);
    setStartTime(undefined);
    openNewLogForm(log_data);
  };

  const preventClickPropogation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  // Update activity if active state has changed, or if different activity (can happen when adding to the list)
  if (nextActivity.active !== activity.active || nextActivity.title !== activity.title) {
    setActivity(nextActivity)
  }
  // Can occur when using across multiple devices
  if (nextActivity.active && !activity.active && !isActive) {
    setStartTime(Date.parse(nextActivity.start));
    setIsActive(true);
  }
  else if (!nextActivity.active && activity.active && isActive) {
    setIsActive(false);
    setDuration(0);
    setStartTime(undefined);
  }

  useEffect(() => {
    let interval = null;
    let timeout = null;
    const timeSinceStart = () => {
      return Date.now() - startTime;
    };
    // For matching the first next tick if timer was already active
    const timeToFirstTick = 1000 - (initialValue % 1000);

    // Start the timer
    if (isActive) {
      // If already active, want to match the first tick to when it should occur, then
      // start the 1s intervals from that first tick
      timeout = setTimeout(() => {
        setDuration(duration => timeSinceStart());
        interval = setInterval(() => {
          setDuration(duration => timeSinceStart());
        }, 1000);
      }, timeToFirstTick);
      // Stop the timer
    }
    else {
      clearTimeout(timeout);
      clearInterval(interval);
    }
    // Clean up
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    }
  }, [activity, nextActivity, isActive, startTime, initialValue]);

  return (
    <div onClick={preventClickPropogation}>
      {(isActive)
        ? <button className='btn btn-danger btn-circle btn-xl timer-on' onClick={stop}>
            <div>{duration ? msToStopwatch(duration) : '00:00:00'}</div>
          </button>
        : <button className='btn btn-info btn-circle btn-xl' onClick={start}>start</button>
      }
    </div>
  )
};

Timer.propTypes = {
  /** Activity for which this timer is bound to */
  activity: PropTypes.object.isRequired,
  /** Dispatches action for opening modal with new log form */
  openNewLogForm: PropTypes.func.isRequired,
  /** Dispatches action to update an activity with new values */
  updateActivity: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  updateActivityStatus: state.status.updateActivity
});

const mapDispatchToProps = {
  openNewLogForm,
  updateActivity,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timer);
