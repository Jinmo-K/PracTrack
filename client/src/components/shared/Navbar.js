import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../actions/authActions';

const Navbar = ({ auth, logoutUser }) => {
    const onLogoutClick = (e) => {
        e.preventDefault();
        logoutUser();
    };

    return (
        <div className='navbar navbar-expand-lg sticky-top p-0'>
            <div className='container'>
                <Link to='/' className='navbar-brand d-flex align-items-center p-0 nav-btn'>
                    <img src='../../../images/logo-sm.png' alt='logo'></img>
                    <strong className='ml-1 mt-1'>PracTrack</strong>
                </Link>
                <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent-7'
                    aria-controls='navbarSupportedContent-7' aria-expanded='false' aria-label='Toggle navigation'>
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse'>
                    {(auth.isAuthenticated) 
                      ?  <ul className='navbar-nav ml-auto'>
                            <li className='nav-item'>
                                <Link to='/settings' className='nav-link nav-btn pb-0'><i className='material-icons'>account_circle</i></Link>
                            </li>
                            <li className='nav-item'>
                                <Link to='/' className='nav-link nav-btn pb-0' onClick={onLogoutClick}>Logout</Link>
                            </li>
                         </ul>
                      :  <ul className='navbar-nav ml-auto'>
                            <li className='nav-item'>
                                <Link to='/' className='nav-link nav-btn pb-0'>Login</Link>
                            </li>
                            <li className='nav-item'>
                                <Link to='/register' className='nav-link nav-btn pb-0'>Signup</Link>
                            </li>
                         </ul>
                    }
                </div>
            </div>
        </div>
    );
    
}


Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
