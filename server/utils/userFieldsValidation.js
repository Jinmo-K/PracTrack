const Validator = require("validator");
const isEmpty = require("is-empty");

const validateName = (data) => {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

const validateEmail = (data) => {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}

const validatePw = (data) => {
  let errors = {};
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
  else if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

const validateRegisterInput = (data) => {
  let errors = {};
  let {errors:nameErrors} = validateName(data);
  let {errors:emailErrors} = validateEmail(data);
  let {errors:pwErrors} = validatePw(data);
  Object.assign(errors, nameErrors, emailErrors, pwErrors);

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

const validateLoginInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.password = !isEmpty(data.password) ? data.password : "";
  let {errors:emailErrors} = validateEmail(data);
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  Object.assign(errors, emailErrors);

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

exports.validateName = validateName;
exports.validateEmail = validateEmail;
exports.validatePw = validatePw;
exports.validateRegisterInput = validateRegisterInput;
exports.validateLoginInput = validateLoginInput;
