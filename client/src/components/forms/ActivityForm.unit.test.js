import React from 'react';
import { mount, shallow } from 'enzyme';
import { ActivityForm } from './ActivityForm';

describe('<ActivityForm />', () => {
  let wrapper;
  const mockEvent = {
    preventDefault: jest.fn(),
  };
  const props= {
    hideForm: jest.fn(),
    addActivity: jest.fn(),
    userId: '0',
    activities: [
      { title: 'invalid' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = shallow(<ActivityForm {...props} />);
  });

  it('Should render initial layout given required props', () => {
    expect(wrapper.getElements()).toMatchSnapshot();
  });

  it('Should reflect user changes in name input', () => {
    wrapper.find('#inputName').simulate('change', { target: { value: 'valid' }});
    expect(wrapper.find('#inputName').props().value).toEqual('valid');
  });

  it('Should reflect user changes in goal input', () => {
    wrapper.find('#inputGoal').simulate('change', { target: { value: 10 }});
    expect(wrapper.find('#inputGoal').props().value).toEqual(10);
  });

  it('Should call hideForm when \'Cancel\' button is clicked', () => {
    const cancelBtn = wrapper.find('#activity-form-cancel-btn');
    cancelBtn.simulate('click');
    expect(props.hideForm).toBeCalledTimes(1);
  });

  it('Should call hideForm when modal header close button is clicked', () => {
    // Mount to render ModalHeader
    wrapper = mount(<ActivityForm {...props} />);
    const closeBtn = wrapper.find('button.close');
    closeBtn.simulate('click');
    expect(props.hideForm).toBeCalledTimes(1);
  });

  it('Should submit and close the form with valid name', () => {
    wrapper.find('#inputName').simulate('change', { target: { value: 'valid' }});
    const submitBtn = wrapper.find('#activity-form-submit-btn');
    submitBtn.simulate('click', mockEvent);
    expect(props.addActivity).toBeCalledTimes(1);
    expect(props.hideForm).toBeCalledTimes(1);
  });

  it('Should not submit or close the form with duplicate name', () => {
    wrapper.find('#inputName').simulate('change', { target: { value: 'invalid' }});
    const submitBtn = wrapper.find('#activity-form-submit-btn');
    submitBtn.simulate('click', mockEvent);
    expect(props.addActivity).toBeCalledTimes(0);
    expect(props.hideForm).toBeCalledTimes(0);
  });

  it('Should not submit or close the form with empty name', () => {
    wrapper.find('#inputName').simulate('change', { target: { value: '' }});
    const submitBtn = wrapper.find('#activity-form-submit-btn');
    submitBtn.simulate('click', mockEvent);
    expect(props.addActivity).toBeCalledTimes(0);
    expect(props.hideForm).toBeCalledTimes(0);
  });

  it('Should not render any name error on submit with valid input', () => {
    wrapper.find('#inputName').simulate('change', { target: { value: 'valid' }});
    const submitBtn = wrapper.find('#activity-form-submit-btn');
    submitBtn.simulate('click', mockEvent);
    expect(wrapper.find('#inputName').props().error).toEqual(false);
    expect(wrapper.find('#inputName').props().helperText).toEqual('');
  });

  it('Should render duplicate name error on submit with duplicate name', () => {
    wrapper.find('#inputName').simulate('change', { target: { value: 'invalid' }});
    const submitBtn = wrapper.find('#activity-form-submit-btn');
    submitBtn.simulate('click', mockEvent);
    expect(wrapper.find('#inputName').props().error).toEqual(true);
    expect(wrapper.find('#inputName').props().helperText).toEqual('Activities must have unique names');
  });

  it('Should render empty name error on submit with empty name', () => {
    wrapper.find('#inputName').simulate('change', { target: { value: '' }});
    const submitBtn = wrapper.find('#activity-form-submit-btn');
    submitBtn.simulate('click', mockEvent);
    expect(wrapper.find('#inputName').props().error).toEqual(true);
    expect(wrapper.find('#inputName').props().helperText).toEqual('Activity must have a name');
  });

  it('Should reset name error on name input focus', () => {
    wrapper.find('#inputName').simulate('change', { target: { value: 'invalid' }});
    const submitBtn = wrapper.find('#activity-form-submit-btn');
    submitBtn.simulate('click', mockEvent);
    expect(wrapper.find('#inputName').props().error).toEqual(true);
    expect(wrapper.find('#inputName').props().helperText).toEqual('Activities must have unique names');
    wrapper.find('#inputName').simulate('focus');
    expect(wrapper.find('#inputName').props().error).toEqual(false);
    expect(wrapper.find('#inputName').props().helperText).toEqual('');
  });

  it('Should render goal error on negative goal input', () => {
    wrapper.find('#inputGoal').simulate('change', { target: { value: -10 }});
    expect(wrapper.find('#inputGoal').props().error).toEqual(true);
    expect(wrapper.find('#inputGoal').props().helperText).toEqual('Goal cannot be negative');
  });

  it('Should not have goal error on valid goal input', () => {
    wrapper.find('#inputGoal').simulate('change', { target: { value: 10 }});
    expect(wrapper.find('#inputGoal').props().error).toEqual(false);
    expect(wrapper.find('#inputGoal').props().helperText).toEqual('');
  });

  it('Should not disable submit button on valid goal input', () => {
    wrapper.find('#inputGoal').simulate('change', { target: { value: 10 }});
    expect(wrapper.find('#activity-form-submit-btn').prop('disabled')).toEqual(false);
  });

  it('Should disable submit button on negative goal input', () => {
    wrapper.find('#inputGoal').simulate('change', { target: { value: -10 }});
    expect(wrapper.find('#activity-form-submit-btn').prop('disabled')).toEqual(true);
  });
});