import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import socket from './utils/socket';
// Components
import Landing from "./components/pages/Landing";
import Register from "./components/pages/user/Register";
import PrivateRoute from "./components/shared/PrivateRoute";
import Navbar from './components/shared/Navbar';
import ActivityPage from './components/pages/activity/ActivityPage';
import ActivitiesList from "./components/pages/dashboard/ActivitiesList";
import AppModal from './components/forms/AppModal';
import PieChart from './components/pages/dashboard/PieChart';
import Settings from './components/pages/user/Settings';
// Functions
import { logoutUser, resetUpdateUser } from "./actions/authActions";
import { getActivities, resetAddActivity, resetUpdateActivity } from './actions/activitiesActions';
import { checkForToken } from "./utils/authHelpers";
// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import "./App.css";

class App extends Component {
  state = {
    flashMessage: '',
    flashStyle: 'alert-warning',
    loading: localStorage.jwtToken ? true : false,
    response: 0
  } 
  componentDidMount() {
    // Check for token to keep user logged in
    checkForToken()
      .then(() => {
        this.setState({ loading: false });
        // Connect to user's socketIO room
        socket.emit('userConnected', {userId: this.props.auth.user.id});
        // Receive and dispatch redux actions that occur on other devices/browsers
        socket.on('action', action => {
          this.props.dispatch({...action, remote: true});
        });
      });
  }
  
  componentDidUpdate = (prevProps) => { 
    if (this.props.auth.isAuthenticated && !prevProps.auth.isAuthenticated) {
      this.props.getActivities(this.props.auth.user.id);
    }
    const status = this.props.status;

    if (status.addActivity === 'SUCCESS') {
      this.displayFlash('Created new activity: '+ status.activity.title + ' !', 'alert-success');
      this.props.resetAddActivity();
    }
    if (status.addActivity === 'ERROR') {
      this.displayFlash('Error! Unable to create new activity: ' + status.addActivityError, 'alert-danger');
      this.props.resetAddActivity();
    }
    if(status.updateUser === 'SUCCESS') {
      this.displayFlash('Successfully updated profile!', 'alert-success');
      this.props.resetUpdateUser();
    }
    if (status.updateUser === 'ERROR') {
      this.displayFlash('Error! Unable to update profile: ' + status.updateUserError, 'alert-danger');
      this.props.resetUpdateUser();
    }
    if (status.updateActivity === 'SUCCESS') {
      if (status.alert) {
        this.displayFlash('Updated activity: '+ status.activity.title + ' !', 'alert-success');
      }
      this.props.resetUpdateActivity();
    }
    if (status.updateActivity === 'ERROR') {
      this.displayFlash('Error! Unable to update activity: ' + status.updateActivityError, 'alert-danger');
      this.props.resetUpdateActivity();
    }
  }

  displayFlash = (message, type) => {
    this.setState({ 
      flashStyle: type,
      flashMessage: message 
    });
    setTimeout(() => {
      this.hideFlash();
    }, 3000);
  }

  hideFlash = () => {
    this.setState({ flashMessage: '' })
  }

  render() {
    return (
        <Router>
            <Navbar />
            {!this.state.loading
            &&
            <div className='container-flex app-text'>
              <div className="container">
                {/* Flash message */}
                { (this.state.flashMessage)
                  ?  <div className={'alert ' + this.state.flashStyle + ' alert-dismissible fade show mt-5 fixed-top flash'}>
                        <strong>{this.state.flashMessage}</strong>
                        <button type="button" className="close" onClick={this.hideFlash}>
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                  : null
                }
                <AppModal />
                {this.props.auth.isAuthenticated 
                 && <PieChart />
                }
                <Switch>
                  <PrivateRoute exact path="/activities/:activityId" 
                    component={ActivityPage} 
                  />
                  <PrivateRoute path='/settings' component={Settings} />
                  <Route exact path="/" 
                    component={this.props.auth.isAuthenticated ? ActivitiesList : Landing} 
                  />
                  <Route path="/register" component={Register} />
                  <Route component={Landing} />
                </Switch>
              </div>
            </div>
            }
        </Router>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
  activities: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,

  logoutUser: PropTypes.func.isRequired,
  getActivities: PropTypes.func.isRequired,
  resetAddActivity: PropTypes.func.isRequired,
  resetUpdateActivity: PropTypes.func.isRequired,
  resetUpdateUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  activities: state.activities,
  status: state.status,
});

const mapDispatchToProps = {
  logoutUser,
  getActivities,
  resetAddActivity,
  resetUpdateActivity,
  resetUpdateUser,
  dispatch: (action) => action,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
