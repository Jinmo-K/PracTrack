import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// Components
import Loading from '../../shared/Loading';
import ActivityTable from './ActivityTable';
// Functions
import { openNewActivityForm } from '../../../actions/formActions';
// Styles
import './ActivitiesList.css';

/** 
 * ============================================
 *   Table displaying user's activities
 * ============================================
 */
class ActivitiesList extends Component {
  state = { 
    // For animating the new activity button
    clicked: ' ',
  };

  onClickNewActivity = () => {
    this.props.openNewActivityForm();
    this.setState({ clicked: true });
    setTimeout(() => 
      this.setState({ clicked: false })
    , 450);
  }

  sortActivities = () => {
    let sortedActivities = Array.from(this.props.activities).sort((a,b) => {
      let dateA = new Date(a.updated);
      let dateB = new Date(b.updated);
      return dateB - dateA;
    });
    return sortedActivities;
  }
  // TODO
  // shouldComponentUpdate(nextProps, nextState) {
  // }

  render() {
    if (this.props.activitiesStatus !== 'SUCCESS') {
      return <Loading />
    }

    return (
        <div>
          {(this.props.activities.length) 
          ? <ActivityTable activities={this.sortActivities()} />
          :
            <div className="text-center pt-5 mt-5 d-flex flex-column justify-content-center align-items-center">
              <p className='lead mt-5'>
                No activities yet. Start a new activity to begin!
              </p>
              {/* Replicating MaterialTable button */}
              <button className="mx-0 xMuiButtonBase-root xMuiIconButton-root xMuiIconButton-colorInherit" 
                      tabIndex="0" 
                      type="button" 
                      onClick={this.onClickNewActivity}
              >
                <span className="xMuiIconButton-label">
                  <span className="material-icons xMuiIcon-root fa fa-plus-circle" aria-hidden="true" style={{'color': 'rgb(76, 175, 80)', 'fontSize': '50px'}} />
                </span>
                <span className="xMuiTouchRipple-root">
                  {(this.state.clicked === true)
                    && <span className="xMuiTouchRipple-ripple xMuiTouchRipple-rippleVisible xMuiTouchRipple-ripplePulsate" 
                             style={{
                               'width': '74px', 
                               'height': '74px', 
                               'top': '-0.5px', 
                               'left': '-0.5px'}}
                        >
                        <span className="xMuiTouchRipple-child xMuiTouchRipple-childPulsate" />
                      </span>
                  }
                  {(this.state.clicked === false) 
                    && <span className='xMuiTouchRipple-child xMuiTouchRipple-childLeaving' />
                  }
                </span>
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
