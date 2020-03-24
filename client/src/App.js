import React, { Component } from "react";
import { connect } from "react-redux";
import store from './store';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
// Components
import Landing from "./components/pages/Landing";
import Register from "./components/pages/user/Register";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from './components/shared/Navbar';
import ActivityPage from './components/pages/activity/ActivityPage';
import ActivitiesList from "./components/pages/dashboard/ActivitiesList";
import AppModal from './components/forms/AppModal';
import PieChart from './components/pages/dashboard/PieChart';
import Settings from './components/pages/user/Settings';
// Functions
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { getActivities, resetAddActivityStatus } from './actions/activitiesActions';
import setAuthToken from "./utils/setAuthToken";
// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import "./App.css";


// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}


class App extends Component {
  state = {
    flashMessage: '',
    flashStyle: 'alert-warning',
  }

  componentDidMount = () => {
    if (this.props.auth.isAuthenticated) {
      this.props.getActivities(this.props.auth.user.id);
    }
  }

  componentDidUpdate = () => { 
    const status = this.props.status;

    if (status.addActivity === 'SUCCESS') {
      this.displayFlash('Created new activity: '+ status.activity.title + ' !', 'alert-success');
      this.props.resetAddActivityStatus();
    }
    if (status.addActivity === 'ERROR') {
      this.displayFlash('Error! Unable to create new activity: ' + status.addActivityError, 'alert-danger');
      this.props.resetAddActivityStatus();
    }
  }

  displayFlash = (message, type) => {
    this.setState({ 
      flashStyle: type,
      flashMessage: message 
    });
    setTimeout(() => {
      this.hideFlash();
    }, 5000);
  }

  hideFlash = () => {
    this.setState({ flashMessage: '' })
  }

  render() {
    return (
        <Router>
            <Navbar />
            <div className='main'>
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
                <div className='row justify-content-center'>
                  <PieChart />
                </div>
                
                <Switch>
                  {/* Create activity page route only after componentDidMount runs */}
                  {(this.props.activities.length) 
                    && <PrivateRoute path="/activities/:activityId" component={ActivityPage} />
                  }
                  <PrivateRoute path='/settings' component={Settings} />
                  <Route path="/register" component={Register} />
                  {this.props.auth.isAuthenticated 
                    && <Route exact path='/' component={ActivitiesList} />
                  }
                  <Route exact path="/" component={Landing} />
                  <Route component={Landing} />
                </Switch>
              </div>
            </div>
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
  resetAddActivityStatus: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  activities: state.activities,
  status: state.status,
});

const mapDispatchToProps = {
  logoutUser,
  getActivities,
  resetAddActivityStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
