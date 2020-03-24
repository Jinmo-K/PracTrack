import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
// Components
import TextField from '@material-ui/core/TextField';
import MaterialTable from 'material-table'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
// Functions
import { deleteLog, updateLog } from '../../../actions/logActions';
import { updateActivity } from '../../../actions/activitiesActions';
import { msToHrsMinSec } from '../../../utils/timeFunctions';


/** 
 * ============================================
 *   Table displaying an activity's logs
 * ============================================
 */
const LogTable = ({ activity, logs, updateLog, deleteLog, updateActivity }) => {
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  const columns = [
    {
      title: 'Start date',
      field: 'start',
      render: rowData => moment(rowData.start).format('dddd MMM D h:mma'),
      editComponent: props => {
        // Valid if start time doesn't overlap previous log and comes before end time)
        var prevEndTime = moment(logs.slice().reverse()[1].end)
        var startTime = moment(props.value);
        var endTime = moment(props.rowData.end)
        if ((startTime > prevEndTime) && (startTime < endTime) && (startError !== '')) {
          setStartError('');
        }

        return <DateTimePicker
                  autoOk
                  disableFuture
                  variant='inline'
                  value={props.value}
                  error={startError ? true : false}
                  helperText={startError}
                  style={{ 'display': 'block' }}
                  minDate={logs.slice().reverse()[1].end}
                  onChange={newStartTime => {
                    // Validate edited start time
                    if (newStartTime < prevEndTime) {
                      setStartError('Cannot overlap previous log');
                    }
                    else if (newStartTime > endTime) {
                      setStartError('Must be before end time');
                    }
                    else {
                      setStartError('');
                    }
                    props.onChange(newStartTime);
                  }}
                />
      },
    },
    {
      title: 'End date',
      field: 'end',
      defaultSort: 'desc',
      render: rowData => moment(rowData.end).format('dddd MMM D h:mma'),
      editComponent: props => {
        // Valid if end time is between start and current time
        var startTime = moment(props.rowData.start);
        var endTime = moment(props.value);
        var currTime = Date.now();
        if ((endTime > startTime) && (endTime < currTime) && (endError !== '')) {
          setEndError('');
        }

        return <DateTimePicker
                  autoOk
                  disableFuture
                  variant='inline'
                  value={props.value}
                  error={endError ? true : false}
                  helperText={endError}
                  style={{ 'display': 'block' }}
                  minDate={props.rowData.start}
                  onChange={newEndTime => {
                    // Validate edited end time
                    if (newEndTime < startTime) {
                      setEndError('End time must come after start time');
                    }
                    else if (newEndTime > currTime) {
                      setEndError('End time cannot be in the future');
                    }
                    else {
                      setEndError('');
                    }
                    props.onChange(newEndTime.valueOf());
                  }}
                />
      },
    },
    {
      title: 'Duration',
      field: 'duration',
      render: rowData => msToHrsMinSec(rowData.duration),
      editComponent: props => {
        var duration = moment(props.rowData.end) - moment(props.rowData.start);

        return (
          <span className={duration < 0 ? 'error-text' : undefined}>
            {msToHrsMinSec(duration)}
          </span>
        );
      },
    },
    {
      title: 'Comments',
      field: 'comments',
      render: rowData => (
        <span className='d-block text-truncate' style={{ 'maxWidth': '170px' }}>
          {rowData.comments}
        </span>
      ),
      editComponent: props => {
        return (
          <TextField
            multiline
            value={props.value}
            onChange={newComment => { props.onChange(newComment.target.value) }}
          />
        )
      }
    }
  ];

  return (
    <div id='logTable' className='app-text'>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className='align-center'>
          <MaterialTable
            title="Logs"
            columns={columns}
            data={logs}
            options={{
              actionsColumnIndex: -1,
              addRowPosition: 'first',
            }}
            detailPanel={[
              rowData => ({
                render: rowData =>
                  <div className='p-3 m-0'>
                    <div className='row p-0'>
                      <label className='col-sm-1'>Start: </label>
                      <span className='col-sm-10 font-weight-normal'>
                        {moment(rowData.start).format('dddd MMM-DD-YY  h:mm:ss a')}
                      </span>
                    </div>
                    <div className='row'>
                      <label className='col-sm-1'>End: </label>
                      <span className='col-sm-10 font-weight-normal'>
                        {moment(rowData.end).format('dddd MMM-DD-YY  h:mm:ss a')}
                      </span>
                    </div>
                    {rowData.comments
                    && <div className='row'>
                          <label className='col-sm-1'>Comments: </label>
                          <div className='col-sm-10 font-weight-normal text-break' style={{'white-space':'pre-wrap', }}>
                            {rowData.comments}
                          </div>
                        </div>
                    }
                  </div>
              })

            ]}
            editable={{
              isEditable: rowData => logs.indexOf(rowData) === logs.length - 1,
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    {
                      // const oldLog = 
                      console.log(newData === oldData)
                      console.log(newData, oldData)
                      if (startError || endError || newData === oldData) {
                        return reject();
                      }
                      const start = moment(newData.start);
                      console.log(newData.start)
                      const end = moment(newData.end);
                      const duration = end.valueOf() - start.valueOf();
                      const newLog = {
                        ...newData,
                        start: newData.start,
                        end: newData.end,
                        duration
                      };  
                      // Must update activity first in order to re-render title
                      updateActivity(activity._id, {
                        totalDuration: activity.totalDuration + duration - oldData.duration
                      })
                      updateLog(newLog);
                    }
                    resolve()
                  }, 500)
                }),
              onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    deleteLog(oldData);
                    resolve()
                  }, 500)
                }),
            }}
          />
        </div>
      </MuiPickersUtilsProvider>
    </div>
  );
};

LogTable.propTypes = {
  updateLog: PropTypes.func.isRequired,
  deleteLog: PropTypes.func.isRequired,
  updateActivity: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  updateLog,
  deleteLog,
  updateActivity,
}

export default connect(
  null,
  mapDispatchToProps
)(LogTable);