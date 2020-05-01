import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router} from 'react-router-dom';
import { Landing } from './Landing';

describe('<Landing />', () => {
  let wrapper;
  let props = {
    history: { push: jest.fn() },
    auth: {
      isAuthenticated: false
    },
    errors: {},
    loginUser: jest.fn(),
    resetAuthErrors: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks();
    props.auth.isAuthenticated = false;
    props.errors = {};
    wrapper = shallow(<Landing {...props} />);
  });

  it('Renders initial layout when user is not logged in', () => {
    let tree = renderer
      .create(
        <Router>
          <Landing {...props} />
        </Router>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Should redirect if user is logged in', () => {
    props.auth.isAuthenticated = true;
    wrapper = shallow(<Landing {...props} />);
    expect(props.history.push.mock.calls[0]).toEqual(['/']);
  });

  it('Should reflect user changes in email field', () => {
    let id = 'email';
    wrapper.find('#'+id).simulate('change', { target: { id, value: 'test' }});
    expect(wrapper.find('#'+id).props().value).toEqual('test');
  });

  it('Should reflect user changes in password field', () => {
    let id = 'password';
    wrapper.find('#'+id).simulate('change', { target: { id, value: 'test' }});
    expect(wrapper.find('#'+id).props().value).toEqual('test');
  });

  it('Should call loginUser when submit button is clicked', () => {
    let mockEvent = {
      preventDefault: jest.fn(),
    };
    wrapper.find('form').simulate('submit', mockEvent);
    expect(mockEvent.preventDefault).toBeCalledTimes(1);
    expect(props.loginUser).toBeCalledTimes(1);
  });

  it('Should render email error', () => {
    wrapper.setState({ errors: { email: 'email error' } });
    expect(wrapper.find('#email').props().helperText).toEqual('email error');
    expect(wrapper.find('#email').props().error).toEqual(true);
  });

  it('Should not render email error', () => {
    wrapper.setState({ errors: { email: '' } });
    expect(wrapper.find('#email').props().error).toEqual(false);
  });

  it('Should render password error', () => {
    wrapper.setState({ errors: { password: 'password error' } });
    expect(wrapper.find('#password').props().helperText).toEqual('password error');
    expect(wrapper.find('#password').props().error).toEqual(true);
  });

  it('Should not render password error', () => {
    wrapper.setState({ errors: { password: '' } });
    expect(wrapper.find('#password').props().error).toEqual(false);
  });

  it('Should reset email error on focus', () => {
    let id = 'email';
    wrapper.setState({ errors: { email: 'email error' } });
    wrapper.find('#'+id).simulate('focus', { target: { id }});
    expect(wrapper.state().errors.email).toEqual('');
  });

  it('Should reset password error on focus', () => {
    let id = 'password';
    wrapper.setState({ errors: { password: 'password error' } });
    wrapper.find('#'+id).simulate('focus', { target: { id }});
    expect(wrapper.state().errors.password).toEqual('');
  });

  it('Should update errors on receiving new props', () => {
    let nextProps = { 
      errors: { 
        email: 'email error', 
        password: 'password error'
      }
    };
    wrapper.instance().componentWillReceiveProps(nextProps);
    expect(wrapper.state().errors.email).toEqual('email error');
    expect(wrapper.state().errors.password).toEqual('password error');
  });

  it('Should not update state on new props without errors', () => {
    wrapper.setState({ errors: { email: 'email error', password: 'password error' } });
    let nextProps = {};
    wrapper.instance().componentWillReceiveProps(nextProps);
    expect(wrapper.state().errors.email).toEqual('email error');
    expect(wrapper.state().errors.password).toEqual('password error');
  });

  it('Should dispatch resetAuthErrors on unmount', () => {
    wrapper.instance().componentWillUnmount();
    expect(props.resetAuthErrors).toBeCalledTimes(1);
    expect(props.resetAuthErrors.mock.calls[0][0].includes('email')).toEqual(true);
    expect(props.resetAuthErrors.mock.calls[0][0].includes('password')).toEqual(true);
  });
});
