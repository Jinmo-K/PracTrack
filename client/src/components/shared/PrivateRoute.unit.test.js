import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import PrivateRoute from './PrivateRoute';

describe('<PrivateRoute />', () => {
  let props;
  const component = () => <p>test</p>;
  const mockStore = configureStore();

  beforeEach(() => {
    props = {
      auth: {
        isAuthenticated: null
      }
    };
  });
  
  it('Renders the component for logged in users only', () => {
    props.auth.isAuthenticated = true;
    let store = mockStore(props);
    let wrapper = mount(
      <Router>
        <PrivateRoute component={component} store={store} />
      </Router>
    );
    expect(wrapper.contains(component)).toEqual(true);
  });

  it('Redirects to login page for unauthorized users', () => {
    props.auth.isAuthenticated = false;
    let store = mockStore(props)
    let wrapper = mount(
      <Router>
        <PrivateRoute component={component} store={store} />
      </Router>
    );
    expect(wrapper.containsMatchingElement(<Redirect to="/" />)).toEqual(true)
  });
});