import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router} from 'react-router-dom';
import { createMemoryHistory } from 'history'
import { Navbar } from './Navbar';

describe('<Navbar />', () => {
  let wrapper;
  // Props
  const logoutUser = jest.fn();
  let history = createMemoryHistory('/');
  const auth_user = {
    isAuthenticated: true
  };
  const auth_visitor = {
    isAuthenticated: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = null;
  });

  it('Should render initial layout correctly for users that are not logged in', () => {
    const tree = renderer
      .create(
        <Router>
          <Navbar history={history} auth={auth_visitor} logoutUser={logoutUser}/>
        </Router>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Should render initial layout correctly for logged in users', () => {
    const tree = renderer
      .create(
        <Router>
          <Navbar history={history} auth={auth_user} logoutUser={logoutUser} />
        </Router>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Should dispatch logout action when logout button is clicked', () => {
    wrapper = shallow(<Navbar history={history} auth={auth_user} logoutUser={logoutUser} />);
    wrapper.find('.logout-btn').first().simulate('click', { preventDefault: jest.fn() });
    expect(logoutUser).toBeCalledTimes(1);
  });
});
