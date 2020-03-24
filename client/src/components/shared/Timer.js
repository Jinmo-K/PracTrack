import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { openNewLogForm } from '../../actions/formActions';
import { updateActivity } from '../../actions/activitiesActions';
import { msToStopwatch } from '../../utils/timeFunctions';

// Stopwatch component 
const Timer = ({ activity, onClick, openNewLogForm, updateActivity }) => {
    // If an activity is active, calculate duration since it started
    const initialValue = activity.active ? Date.now() - Date.parse(activity.start) : 0;
    const [duration, setDuration] = useState(initialValue);
    const [isActive, setIsActive] = useState((initialValue > 0) ? true : false);
    const [startTime, setStartTime] = useState((initialValue > 0) ? (Date.now() - initialValue) : undefined);

    // Start the timer and set activity as active in the db
    const start = () => {
        const currTime = Date.now();
        setStartTime(currTime);
        setIsActive(true);
        updateActivity(activity._id, { active: true, start: currTime });
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
        setDuration(0);
        setStartTime(undefined);
        updateActivity(activity._id, { active: false });
        openNewLogForm(log_data);
    };

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
    }, [isActive, startTime, initialValue]);

    return (
        <div onClick={onClick}>
            {/* <strong className='col-md-4'>{duration ? msToStopwatch(duration) : ''}</strong>   */}
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
    openNewLogForm: PropTypes.func.isRequired,
    updateActivity: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
    openNewLogForm,
    updateActivity,
};

export default connect(
    null,
    mapDispatchToProps,
)(Timer);
