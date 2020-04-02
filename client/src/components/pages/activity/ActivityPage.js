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
  emptyLogs,
  resetGetLogs,
  resetUpdateLog
} from '../../../actions/logActions';
import { getActivity, resetGetActivity } from '../../../actions/activitiesActions';


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
    this.props.getActivity(this.activityId);
    this.props.getActivityLogs(this.props.auth.user.id, this.activityId);
  }

  componentDidUpdate() {
    if (this.props.getActivityStatus === 'SUCCESS') {
      this.props.resetGetActivity();
    }
    if (this.props.getLogsStatus === 'SUCCESS') {
      this.props.resetGetLogs();
    }
    if (this.props.updateLogStatus === 'SUCCESS') {
      this.props.resetUpdateLog();
    }
  }

  componentWillUnmount() {
    this.props.emptyLogs();
  }

  // Only re-render if logs data changes or activity loaded
  shouldComponentUpdate(nextProps, nextState) {
    const curr = this.props.logs;
    const updated = nextProps.logs;

    return curr !== updated || this.props.getLogsStatus !== nextProps.getLogsStatus || nextProps.getActivityStatus === 'SUCCESS'
  }

  render() {
    if (this.props.getLogsStatus === 'LOADING' || this.props.getActivityStatus === 'LOADING') {
      return <Loading />
    }
    else if (this.props.getLogsStatus === 'ERROR') {
      return (
        <div>
          Error! {this.props.getLogsError}
        </div>
      )
    }

    const activity = this.props.activity;
    // Only include logs for this activity
    const logs = this.props.logs.filter(el => el.activityId === activity._id);

    return (
      <div>
        {/* Only render the page once activity has loaded */}
        {this.props.activity.title
        && <div>
            {/* An activity with logs */}
            {(this.props.logs.length)
              ? <React.Fragment>
                  <div className='row mb-5 mx-sm-auto'>
                    <div className='col-lg-4 mt-4 p-4 p-sm-0'>
                      <Title activity={activity} />
                    </div>
                    <div className='col-lg-8'>
                      <ActivityChart logs={logs} />
                    </div>
                  </div>
                  <LogTable logs={logs} activity={activity} />
                </React.Fragment>
              : 
                // Activity without logs
                <div className="text-center pt-0 pt-sm-3 mt-5 d-flex flex-column justify-content-center">
                  <Title activity={activity} />
                  <p className='lead mt-5'>
                    You haven't logged any time yet.
                  </p>
                </div>
            }
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
  emptyLogs: PropTypes.func.isRequired,
  resetGetLogs: PropTypes.func.isRequired,
  resetUpdateLog: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  activities: state.activities,
  activity: state.status.activity,
  logs: state.logs,
  getLogsStatus: state.status.logs,
  getLogsError: state.status.logsError,
  updateLogStatus: state.status.updateLog,
  updateLogError: state.status.updateLogError,
  getActivityStatus: state.status.getActivity,
});

const mapDispatchToProps = {
  getActivityLogs,
  getActivity,
  resetGetActivity,
  emptyLogs,
  resetGetLogs,
  resetUpdateLog,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityPage);

