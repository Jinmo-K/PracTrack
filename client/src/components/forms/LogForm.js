import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
// Components
import { ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
// Functions
import { useInput } from '../../hooks/useInput';
import { hideForm } from '../../actions/formActions';
import { addLog } from '../../actions/logActions';
import { msToHrsMinSec } from '../../utils/timeFunctions';


/** 
 * =========================================
 *   New log form, displayed in AppModal
 * =========================================
 */
const LogForm = ({ data, hideForm, addLog }) => {
  // Inputs
  const { value: comments, bindProps: bindComment } = useInput('');
  const start = data.startTime;
  const [end, setEnd] = useState(data.endTime);
  const [duration, setDuration] = useState(data.endTime - data.startTime);
  // Errors
  const [endError, setEndError] = useState('')

  // Make duration reflect user changes to date
  if (end - start !== duration) {
    setDuration(end - start)
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (!endError) {
      let newLog = {
        userId: data.activity.userId,
        activityId: data.activity._id,
        start,
        end,
        duration,
        comments
      };
      addLog(data.activity._id, newLog);
      hideForm();
    }
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <form className='log-form' noValidate onSubmit={onSubmit}>
        <ModalHeader toggle={hideForm}>
          New log for {data.activity.title}
        </ModalHeader>
        <ModalBody>
          <div className='p-0 p-sm-2 justify-content-center container'>
            {/* Start time datetime picker */}
            <div className='form-group row mb-1 mb-sm-3 align-items-center'>
              <label className='col-12 col-sm-3 text-left h1 lead text-sm-right' htmlFor='startTimeInput'>
                Start time
              </label>
              <div className='col-12 col-sm-9'>
                <DateTimePicker
                  id='startTimeInput'
                  disabled
                  inputVariant="outlined"
                  value={start}
                />
              </div>
            </div>

            {/* End time datetime picker */}
            <div className='form-group row mb-1 mb-sm-3 align-items-center'>
              <label className='col-12 col-sm-3 text-left h1 lead text-sm-right' htmlFor='endTimeInput'>
                End time
              </label>
              <div className='col-12 col-sm-9'>
                <DateTimePicker
                  id='endTimeInput'
                  autoOk
                  disableFuture
                  variant='inline'
                  inputVariant="outlined"
                  error={!!endError}
                  helperText={endError}
                  minDate={start}
                  value={end}
                  onChange={(end) => {
                    if (end < moment(start)) {
                      setEndError('End time cannot come before start time')
                    }
                    else if (end > Date.now()) {
                      setEndError('End time cannot be in the future');
                    }
                    else {
                      setEndError('');
                    }
                    setEnd(end.valueOf());
                  }}
                />
              </div>
            </div>

            {/* Duration */}
            <div className='form-group row mb-1 mb-sm-3 align-items-center'>
              <span className='col-12 col-sm-3 text-left h1 lead text-sm-right'>
                Duration
              </span>
              <div className='col-12 col-sm-9 h4 app-text text-center text-sm-left'>
                {msToHrsMinSec(duration)}
              </div>
            </div>

            {/* Comments input */}
            <div className='form-group row align-items-center'>
              <label className='col-12 col-sm-3 mb-1 mb-sm-3 text-left h1 lead text-sm-right' htmlFor='inputComment'>
                Comments 
              </label>
              <div className='col-12 col-sm-9 ml-sm-auto'>
                <TextField
                  id='inputComment'
                  multiline
                  rows="4"
                  variant="outlined"
                  {...bindComment}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={hideForm}>Cancel</Button>{' '}
          <Button color="info" disabled={!!endError}>Save</Button>
        </ModalFooter>
      </form>
    </MuiPickersUtilsProvider>
  );
};

LogForm.propTypes = {
  data: PropTypes.object.isRequired,
  hideForm: PropTypes.func.isRequired,
  addLog: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.form.data,
});

const mapDispatchToProps = {
  hideForm,
  addLog,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogForm);