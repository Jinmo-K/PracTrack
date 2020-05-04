import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { Settings } from './Settings';

describe('<Settings />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      user: {
        id: '0',
        name: 'Test User',
        email: 'test@test.com',
      },
      errors: {},
      updateUser: jest.fn(),
      resetAuthErrors: jest.fn(),
      updateUserStatus: ''
    };
    jest.clearAllMocks();
    wrapper = shallow(<Settings {...props} />);
  });

  it('Should render initial layout given required props', () => {
    let tree = renderer.create(<Settings {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('Name field', () => {
    it('Should reflect user input in name field', () => {
      wrapper.find('#name').simulate('change', { target: { value: 'test' } });
      expect(wrapper.find('#name').props().value).toEqual('test');
    });
  
    it('Should display name error', () => {
      props.errors = { name: 'Name error' };
      wrapper = shallow(<Settings {...props} />);
      expect(wrapper.find('#name-error').props().children).toEqual('Name error');
    });
  
    it('Should enable submit button when name field differs from original value', () => {
      wrapper = mount(<Settings {...props} />);
      wrapper.find('input#name').simulate('change', { target: { value: 'different' } });
      expect(wrapper.find('[type="submit"]').props().disabled).toEqual(false);
    });
  
    it('Should disable submit button when name field equals the original value', () => {
      wrapper = mount(<Settings {...props} />);
      wrapper.find('input#name').simulate('change', { target: { value: props.user.name } });
      expect(wrapper.find('[type="submit"]').props().disabled).toEqual(true);
    });
  });

  describe('Email field', () => {
    it('Should reflect user input in e-mail field', () => {
      wrapper.find('#email').simulate('change', { target: { value: 'test' } });
      expect(wrapper.find('#email').props().value).toEqual('test');
    });
  
    it('Should display e-mail error', () => {
      props.errors = { email: 'E-mail error' };
      wrapper = shallow(<Settings {...props} />);
      expect(wrapper.find('#email-error').props().children).toEqual('E-mail error');
    });
  
    it('Should enable submit button when e-mail field differs from original value', () => {
      wrapper = mount(<Settings {...props} />);
      wrapper.find('input#email').simulate('change', { target: { value: 'different' } });
      expect(wrapper.find('[type="submit"]').props().disabled).toEqual(false);
    });
  
    it('Should disable submit button when e-mail field equals the original value', () => {
      wrapper = mount(<Settings {...props} />);
      wrapper.find('input#email').simulate('change', { target: { value: props.user.email } });
      expect(wrapper.find('[type="submit"]').props().disabled).toEqual(true);
    });
  });

  describe('Password fields', () => {
    it('Should reflect user input in password field', () => {
      wrapper.find('#pw').simulate('change', { target: { value: 'test' } });
      expect(wrapper.find('#pw').props().value).toEqual('test');
    });
  
    it('Should display current password error', () => {
      props.errors = { currPassword: 'Password error' };
      wrapper = shallow(<Settings {...props} />);
      expect(wrapper.find('#pw-error').props().children).toEqual('Password error');
    });
  
    // New password field
    it('Should reflect user input in new password field', () => {
      wrapper.find('#new-pw').simulate('change', { target: { value: 'test' } });
      expect(wrapper.find('#new-pw').props().value).toEqual('test');
    });
  
    it('Should display new password error', () => {
      props.errors = { password: 'Password error' };
      wrapper = shallow(<Settings {...props} />);
      expect(wrapper.find('#new-pw-error').props().children).toEqual('Password error');
    });
  
    // Confirm password field
    it('Should reflect user input in confirm password field', () => {
      wrapper.find('#confirm-pw').simulate('change', { target: { value: 'test' } });
      expect(wrapper.find('#confirm-pw').props().value).toEqual('test');
    });
  
    it('Should display confirm password error', () => {
      props.errors = { password2: 'Password error' };
      wrapper = shallow(<Settings {...props} />);
      expect(wrapper.find('#confirm-pw-error').props().children).toEqual('Password error');
    });
  
    it('Should enable submit button when new and confirm password fields present', () => {
      wrapper = mount(<Settings {...props} />);
      wrapper.find('input#new-pw').simulate('change', { target: { value: 'test' } });
      wrapper.find('input#confirm-pw').simulate('change', { target: { value: 'test' } });
      expect(wrapper.find('[type="submit"]').props().disabled).toEqual(false);
    });
  
    it('Should disable submit button when either new or confirm password fields not present', () => {
      wrapper = mount(<Settings {...props} />);
      wrapper.find('input#new-pw').simulate('change', { target: { value:'test' } });
      expect(wrapper.find('[type="submit"]').props().disabled).toEqual(true);
      wrapper.find('input#new-pw').simulate('change', { target: { value:'' } });
      wrapper.find('input#confirm-pw').simulate('change', { target: { value:'test' } });
      expect(wrapper.find('[type="submit"]').props().disabled).toEqual(true);
    });
  
    it('Should reveal password fields when \'Change password\' button clicked', () => {
      wrapper.find('#change-pw-btn').simulate('click');
      expect(wrapper.find('#collapse').props().in).toEqual(true);
      expect(wrapper.find('#fade').props().in).toEqual(true);
    });
  
    it('Should hide password fields when \'Change password\' button clicked', () => {
      wrapper.find('#change-pw-btn').simulate('click');
      wrapper.find('#change-pw-btn').simulate('click');
      expect(wrapper.find('#collapse').props().in).toEqual(false);
      expect(wrapper.find('#fade').props().in).toEqual(false);
    });
  
    it('Should hide password fields when user has updated successfully', () => {
      wrapper = mount(<Settings {...props} />);
      wrapper.find('#change-pw-btn').simulate('click');
      wrapper.setProps({ updateUserStatus: 'SUCCESS' });
      wrapper.update();
      expect(wrapper.find('#collapse').first().props().in).toEqual(false);
      expect(wrapper.find('#fade').first().props().in).toEqual(false);
    });
  });

  describe('Cleanup', () => {
    it('Should dispatch resetAuthErrors on unmount if any error exists', () => {
      props.errors = { name: 'name error' };
      wrapper = mount(<Settings {...props} />);
      wrapper.unmount();
      expect(props.resetAuthErrors).toBeCalledTimes(1);
      expect(props.resetAuthErrors.mock.calls[0][0].includes('name')).toEqual(true);
      expect(props.resetAuthErrors.mock.calls[0][0].includes('email')).toEqual(true);
      expect(props.resetAuthErrors.mock.calls[0][0].includes('currPassword')).toEqual(true);
      expect(props.resetAuthErrors.mock.calls[0][0].includes('password')).toEqual(true);
      expect(props.resetAuthErrors.mock.calls[0][0].includes('password2')).toEqual(true);
    });
  
    it('Should not dispatch resetAuthErrors on unmount when there are no errors', () => {
      wrapper = mount(<Settings {...props} />);
      wrapper.unmount();
      expect(props.resetAuthErrors).toBeCalledTimes(0);
    });
  });

  describe('updateUser function', () => {
    const mockEvent = {
      preventDefault: jest.fn()
    };

    it('Should dispatch updateUser on submit', () => {
      wrapper.find('form').simulate('submit', mockEvent);
      expect(mockEvent.preventDefault).toBeCalledTimes(1);
      expect(props.updateUser).toBeCalledTimes(1);
    });

    it('Should dispatch updateUser with correct user ID', () => {
      wrapper.find('form').simulate('submit', mockEvent);
      expect(props.updateUser.mock.calls[0][0]).toEqual(props.user.id);
    });

    it('Should dispatch updateUser with current password value', () => {
      wrapper.find('#pw').simulate('change', { target: { value: 'newPw' } });
      wrapper.find('form').simulate('submit', mockEvent);
      expect(props.updateUser.mock.calls[0][1].currPassword).toEqual('newPw');
    });
  
    it('Should dispatch updateUser with new name value', () => {
      wrapper.find('#name').simulate('change', { target: { value: 'new' } });
      wrapper.find('form').simulate('submit', mockEvent);
      expect(props.updateUser.mock.calls[0][1].name).toEqual('new');
    });

    it('Should dispatch updateUser with new email value', () => {
      wrapper.find('#email').simulate('change', { target: { value: 'new' } });
      wrapper.find('form').simulate('submit', mockEvent);
      expect(props.updateUser.mock.calls[0][1].email).toEqual('new');
    });

    it('Should dispatch updateUser with new password value', () => {
      wrapper.find('#new-pw').simulate('change', { target: { value: 'new' } });
      wrapper.find('form').simulate('submit', mockEvent);
      expect(props.updateUser.mock.calls[0][1].password).toEqual('new');
    });

    it('Should dispatch updateUser with confirm password value', () => {
      wrapper.find('#confirm-pw').simulate('change', { target: { value: 'new' } });
      wrapper.find('form').simulate('submit', mockEvent);
      expect(props.updateUser.mock.calls[0][1].password2).toEqual('new');
    });
  });
});
