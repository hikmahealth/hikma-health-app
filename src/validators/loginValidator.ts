import validate from 'validate.js';

const constraints = {
  email: {
    presence: true,
    email: true,
  },

  password: {
    presence: true,
  },
};

const loginValidator = state => validate(state, constraints) || {};

export { loginValidator as default };