import validator from 'validator';

export function validateSignup({ name, email, password }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Name too short';
  if (!email || !validator.isEmail(email)) errors.email = 'Invalid email';
  if (!password || password.length < 6) errors.password = 'Password too short';
  return errors;
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email || !validator.isEmail(email)) errors.email = 'Invalid email';
  if (!password) errors.password = 'Password required';
  return errors;
}
