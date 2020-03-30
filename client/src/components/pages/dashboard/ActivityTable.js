import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactTimeAgo from 'react-time-ago';
// Components
import TextField from '@material-ui/core/TextField';
import MaterialTable from 'material-table'
import ProgressBar from '../../shared/ProgressBar';
import Timer from '../../shared/Timer';
import Icon from '@material-ui/core/Icon';
import { green } from '@material-ui/core/colors';
// Functions
import { updateActivity, deleteActivity } from '../../../actions/activitiesActions';
import { openNewActivityForm } from '../../../actions/formActions';
import { msToHrsMinSec } from '../../../utils/timeFunctions';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import './ActivityTable.css';

const cellStyle = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
  textAlign: 'center',
  fontSize: '1rem',

}


/** 
 * ============================================
 *   List of user's activities
 * ============================================
 */
const ActivityTable = ({ activities, history, openNewActivityForm, updateActivity, deleteActivity, userId }) => {
  const sm = useMediaQuery('(min-width:576px)'); // Bootstrap sm
  const [isEditing, setIsEditing] = useState(false);
  const tableRef = React.createRef();

  const onClick = (e, activity) => {
    history.push(`/activities/${activity._id}`)
  };

  const onDelete = (e, data) => {
    setIsEditing(false);
    let titles = (data.length > 1) 
                  ? Array.from(data).splice(1).reduce((acc, curr) => acc + ', ' + curr.title, data[0].title) 
                  : data[0].title;
    let confirmed = window.confirm('You\'re about to delete ' + titles + ' and all associated data. Are you sure?');
    if (confirmed) { 
      data.forEach(activity => deleteActivity(userId, activity._id)); 
    }
    tableRef.current.onAllSelected(false)  
  };

  const columns = [
    {
      title: 'Activity', field: 'title',
      cellStyle: cellStyle,
      render: activity => <span>{activity.title}</span>
    },
    {
      title: 'Total', field: 'totalDuration',
      cellStyle: cellStyle,
      render: activity => (
        <React.Fragment>
          {msToHrsMinSec(activity.totalDuration)}
          {(activity.goal)
            && <ProgressBar current={activity.totalDuration} goal={activity.goal * 3600000} showText={false} />
          }
        </React.Fragment>
      ),
    },
    {
      title: 'Last updated', field: 'updated',
      defaultSort: 'desc',
      cellStyle: cellStyle,
      render: activity => (
        <ReactTimeAgo date={new Date(activity.updated)} />
      )
    },
    {
      title: 'Actions',
      sorting: false,
      cellStyle: cellStyle,
      render: activity => (
        <React.Fragment>
          <Timer activity={activity} />
        </React.Fragment>
      )
    }
  ];

  return (
    <div id='logTable' className='app-text pb-4 mt-4'>
      <MaterialTable
        title=''
        tableRef={tableRef}
        columns={
          sm ? columns 
             : columns.filter(column => column.title === 'Activity' || column.title === 'Actions')
        }
        data={activities}
        options={{
          actionsColumnIndex: -1,
          addRowPosition: 'first',
          draggable: false,
          paging: false,
          searchFieldAlignment: 'right',
          selection: isEditing,
          searchFieldStyle: {
            opacity: '0.5'
          },
          rowStyle: {
            cursor: 'none',
          },
          headerStyle: {
            textAlign: 'center',
            padding: '0.75rem',
            fontSize: '1.2rem',
            borderBottomColor: 'rgba(160, 160, 160, 0.5)',
            borderBottomStyle: 'solid',
            borderBottomWidth: '2px',
            display: 'table-cell',
            fontWeight: 'bold',
            fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
            color: 'rgb(68, 63, 85)',
          },
        }}
        onRowClick={onClick}
        actions =
          {(isEditing)
                  // Toolbar actions available upon select
            ? [{
                  icon: 'delete',
                  tooltip: 'Delete',
                  onClick: onDelete
                },
                {
                  icon: 'cancel',
                  tooltip: 'Cancel',
                  onClick: () => { 
                    setIsEditing(false);
                    tableRef.current.onAllSelected(false)  
                  },
                },
                  // Cancel action in toolbar when no selections
                {
                  icon: 'cancel',
                  tooltip: 'Cancel',
                  isFreeAction: true,
                  onClick: () => setIsEditing(false)
                }]
            :     // Default toolbar actions
              [{
                icon: () => <Icon className="fa fa-plus-circle" style={{ color: green[500], fontSize: 30 }} />,
                tooltip: 'Add activity',
                isFreeAction: true,
                onClick: () => openNewActivityForm()
              },
              {
                icon: 'edit',
                tooltip: 'Edit activities',
                isFreeAction: true,
                onClick: () => setIsEditing(true)
              }]
          }
        style={{
          transition: 'all 0.2s',
          boxShadow: sm ? '0 .5rem 1rem rgba(0,0,0,.15)' : 'none',
          color: '#514B64',
          borderRadius: '.25rem',
          fontSize: '1rem',
        }}
      />
    </div>
  );
};

ActivityTable.propTypes = {
  openNewActivityForm: PropTypes.func.isRequired,
  updateActivity: PropTypes.func.isRequired,
  deleteActivity: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
});

const mapDispatchToProps = {
  openNewActivityForm,
  updateActivity,
  deleteActivity,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityTable));