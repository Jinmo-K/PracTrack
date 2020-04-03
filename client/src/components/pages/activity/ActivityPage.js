import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Components
import ActivityChart from './ActivityChart';
import Title from './Title';
import Loading from '../../shared/Loading';
import LogTable from './LogTable';
// Functions
import {
  getActivityLogs,
  flushLogs,
  resetGetLogs,
  resetUpdateLog
} from '../../../actions/logActions';

/** 
 * ============================================
 *   Display information about an activity
 * ============================================
 */
class ActivityPage extends Component {
  constructor(props) {
    super(props);
    this.activityId = this.props.match.params.activityId;
    this.state = {
      startError: '',
      endError: ''
    }
  }

  componentDidMount() {
    this.props.getActivityLogs(this.props.auth.user.id, this.activityId);
  }

  componentDidUpdate() {
    if (this.props.getLogsStatus === 'SUCCESS') {
      this.props.resetGetLogs();
    }
    if (this.props.updateLogStatus === 'SUCCESS') {
      this.props.resetUpdateLog();
    }
  }

  componentWillUnmount() {
    this.props.flushLogs();
  }

  render() {
    if (this.props.getLogsStatus === 'LOADING' || this.props.activitiesStatus === 'LOADING') {
      return <Loading />
    }
    else if (this.props.getLogsStatus === 'ERROR') {
      return (
        <div>
          Error! {this.props.getLogsError}
        </div>
      )
    }
    const activity = this.props.activities.find(el => el._id === this.activityId);
    if (!activity) window.location.href = '/';
    const logs = this.props.logs.filter(el => el.activityId === activity._id);

    return (
      <div>
        {/* An activity with logs */}
        {(logs.length)
          ? <React.Fragment>
              <div className='row mb-5 mx-sm-auto'>
                <div className='col-lg-4 mt-4 p-4 p-sm-0'>
                  <Title activity={activity}/>
                </div>
                <div className='col-lg-8'>
                  <ActivityChart logs={logs}/>
                </div>
              </div>
              <LogTable logs={logs} activity={activity}/>
            </React.Fragment>
          : 
            // Activity without logs
            <div className="text-center pt-0 pt-sm-3 mt-5 d-flex flex-column justify-content-center">
              <Title activity={activity}/>
              <p className='lead mt-5'>
                You haven't logged any time yet.
              </p>
            </div>
        }
      </div>
    );
  }
}

ActivityPage.propTypes = {
  auth: PropTypes.object.isRequired,
  activities: PropTypes.array.isRequired,
  logs: PropTypes.array.isRequired,
  getLogsStatus: PropTypes.string.isRequired,
  getLogsError: PropTypes.string.isRequired,
  updateLogStatus: PropTypes.string.isRequired,
  updateLogError: PropTypes.string.isRequired,

  getActivityLogs: PropTypes.func.isRequired,
  flushLogs: PropTypes.func.isRequired,
  resetGetLogs: PropTypes.func.isRequired,
  resetUpdateLog: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  activities: state.activities,
  logs: state.logs,
  getLogsStatus: state.status.logs,
  getLogsError: state.status.logsError,
  updateLogStatus: state.status.updateLog,
  updateLogError: state.status.updateLogError,
  updateActivityStatus: state.status.updateActivity,
  activitiesStatus: state.status.activities,
});

const mapDispatchToProps = {
  getActivityLogs,
  resetGetLogs,
  resetUpdateLog,
  flushLogs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityPage);

