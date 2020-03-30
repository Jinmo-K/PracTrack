import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import PropTypes from 'prop-types';
// Components
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ProgressBar from '../../shared/ProgressBar';
import Timer from '../../shared/Timer';
// Functions
import { msToHrsMinSec } from '../../../utils/timeFunctions';
import { deleteActivity } from '../../../actions/activitiesActions';


/** 
 * ============================================
 *   An entry of the Activities list
 * ============================================
 */
const ActivityItem = ({ activity, userId, history, deleteActivity }) => {
  const onClick = () => {
    history.push(`/activities/${activity._id}`)
  }

  const preventClickPropogation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const onDelete = (e) => {
    preventClickPropogation(e);
    let confirmed = window.confirm('You\'re about to delete ' + activity.title + ' and all of its data. Are you sure?');
    if (confirmed) { deleteActivity(userId, activity._id) }
  };

  return (
    <tr className='app-text' onClick={onClick}>
      <td>
        <strong>{activity.title}</strong>
      </td>
      <td className='d-none d-sm-table-cell'>
        <strong>{msToHrsMinSec(activity.totalDuration)}</strong>
        {(activity.goal)
          && <ProgressBar current={activity.totalDuration} goal={activity.goal * 3600000} showText={false} />
        }
      </td>
      <td className='d-none d-sm-table-cell'>
        <strong><ReactTimeAgo date={new Date(activity.updated)} /></strong>
      </td>
      <td>
        <Timer activity={activity}
          onClick={preventClickPropogation}
        />
        <DeleteOutlinedIcon />
        <a href="#" onClick={onDelete}>delete</a>
      </td>
    </tr>
  );
};

ActivityItem.propTypes = {
  activity: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  deleteActivity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
});

export default withRouter(connect(
  mapStateToProps,
  { deleteActivity }
)(ActivityItem));