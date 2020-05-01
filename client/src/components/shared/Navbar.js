import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// Components
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
// Functions
import { logoutUser } from '../../actions/authActions';

const Navbar = ({ auth, logoutUser, history }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [path, setPath] = useState(history.location.pathname);
  const toggleOpen = () => setIsOpen(!isOpen);

  /**
   * Handles logout button click by calling logoutUser function
   * @param {React.MouseEvent} e  The mouse-click event 
   */
  const onLogoutClick = (e) => {
    e.preventDefault();
    logoutUser();
  };

  /**
   * Closes the (mobile) navbar if it is open and user navigates to a different page
   */
  useEffect(() => {
    if (history.location.pathname !== path) {
      setPath(history.location.pathname);
      setIsOpen(false);
    }
  }, [history.location.pathname, path]);

  return (
    <div className='navbar navbar-light navbar-expand-sm sticky-top p-0'>
      <div className='container'>
        <Link to='/' className='navbar-brand d-flex align-items-center p-0 nav-btn'>
          <img src='../../../images/logo-sm.png' alt='logo'></img>
          <strong className='ml-1 mt-1'>PracTrack</strong>
        </Link>
        <button className='navbar-toggler' type='button' onClick={toggleOpen}>
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse'>
          {(auth.isAuthenticated)
            ? <ul className='navbar-nav ml-auto'>
                <li className='nav-item'>
                  <Link to='/settings' className='nav-link nav-btn pb-0'>
                    <i className='material-icons'>account_circle</i>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link to='/' 
                        className='nav-link nav-btn pb-0 logout-btn' 
                        onClick={onLogoutClick}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            : <ul className='navbar-nav ml-auto'>
                <li className='nav-item'>
                  <Link to='/' className='nav-link nav-btn pb-0'>
                    Login
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link to='/register' className='nav-link nav-btn pb-0'>
                    Signup
                  </Link>
                </li>
              </ul>
          }
        </div>
      </div>
      {/* Dropdown menu for mobile */}
      <div className='d-block d-sm-none w-100' style={{fontWeight: 'bold'}}> 
        <Collapse in={isOpen} collapsedHeight={0} timeout={200}>
          <Fade in={isOpen} timeout={400}>
            <div className='pl-4 pr-2 mb-2'>
              {(auth.isAuthenticated)
              ? <ul className='navbar-nav'>
                  <li className='nav-item align-items-center'>
                    <Link to='/settings' className='nav-link nav-btn pb-0'>
                      Settings
                    </Link>
                  </li>
                  <span className="border" style={{maxWidth: '10ch'}}></span>
                  <li className='nav-item'>
                    <Link to='/' 
                          className='nav-link nav-btn pb-0 logout-btn' 
                          onClick={onLogoutClick}
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              :
                <ul className='navbar-nav'>
                  <li className='nav-item align-items-center'>
                    <Link to='/' className='nav-link nav-btn pb-0'>
                      Login
                    </Link>
                  </li>
                  <span className="border" style={{maxWidth: '10ch'}}></span>
                  <li className='nav-item'>
                    <Link to='/register' className='nav-link nav-btn pb-0'>
                      Signup
                    </Link>
                  </li>
                </ul>
              }
            </div> 
          </Fade>
        </Collapse>
      </div>
    </div>
  );
}


Navbar.propTypes = {
  /** Function that dispatches logout action */
  logoutUser: PropTypes.func.isRequired,
  /** Auth store state */
  auth: PropTypes.object.isRequired,
  /** Router history */
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default withRouter(connect(
  mapStateToProps,
  { logoutUser }
)(Navbar));

export { Navbar };
