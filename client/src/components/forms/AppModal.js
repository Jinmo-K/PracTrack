import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
// Components
import LogForm from './LogForm';
import ActivityForm from './ActivityForm';
// Functions
import { hideForm } from '../../actions/formActions';

/** 
 * ==========================================
 *   Modal for new log/activity forms
 * ==========================================
 */
const AppModal = ({ isVisible, formType, hideForm }) => {
  const form = {
    'NEW_ACTIVITY': <ActivityForm />,
    'NEW_LOG': <LogForm />
  };

  return (
    <div>
      <Modal isOpen={isVisible} toggle={hideForm}>
        { 
          form[formType] 
        }
      </Modal>
    </div>
  );
}

AppModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  formType: PropTypes.string.isRequired,
  hideForm: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  isVisible: state.form.formVisible,
  formType: state.form.formType,
});

export default connect(
  mapStateToProps,
  { hideForm }
)(AppModal);