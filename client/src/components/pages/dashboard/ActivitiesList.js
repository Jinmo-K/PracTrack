import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// Components
import ActivityItem from './ActivityItem';
import Loading from '../../shared/Loading';
// Functions
import { openNewActivityForm } from '../../../actions/formActions';

/** 
 * ============================================
 *   Table displaying user's activities
 * ============================================
 */
class ActivitiesList extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      sortKey: 'updated',
      sortAsc: false,
    };
  }

  displayActivities = () => {
    const sortKey = this.state.sortKey;
    const sortedActivities = Array.from(this.props.activities).sort((a, b) => {
      if (sortKey === 'updated') {
        let aDate = new Date(a[sortKey]);
        let bDate = new Date(b[sortKey]);

        if (this.state.sortAsc) {
          // ascending by date
          return aDate - bDate;
        }
        else {
          // descending by date
          return bDate - aDate;
        }
      }
      else { 
        if (this.state.sortAsc ) {
          // ascending
          return a[sortKey] > b[sortKey] ? 1: -1;
        }
        else {
          //descending
          return a[sortKey] > b[sortKey] ? -1: 1;
        }
      }
    });
    
    return sortedActivities.map(curr => {
      return <ActivityItem activity={ curr } key={ curr._id } />;
    });
  }

  render() {
    if (this.props.activitiesStatus !== 'SUCCESS') {
      return <Loading />
    }

    return (
        <div style={{ marginTop: "5%" }}>
              {(this.props.activities.length) 
              ? <div>
                  <table className="table table-hover bg-white p-4 rounded shadow h-100 table-align">
                    <thead className="thead">
                      <tr>
                        <th>Activity</th>
                        <th>Total</th>
                        <th className='d-none d-sm-table-cell'>Last updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.displayActivities()}
                    </tbody>
                  </table>
                  <button className='create-activity-button' onClick={this.props.openNewActivityForm}>
                    <i className='material-icons'>add_circle</i>
                  </button> 
                </div>
              :
                <div className='create-activity-container'>Start a new activity
                  <button className='create-activity-button' onClick={this.props.openNewActivityForm}>
                    <i className='material-icons'>add_circle</i>
                  </button>
                </div>  
              }
        </div>
    );
  }
}

ActivitiesList.propTypes = {
  auth: PropTypes.object.isRequired,
  activities: PropTypes.array.isRequired,
  activitiesStatus: PropTypes.string.isRequired,

  openNewActivityForm: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  activities: state.activities,
  activitiesStatus: state.status.activities,

});
const mapDispatchToProps = {
  openNewActivityForm,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivitiesList);
