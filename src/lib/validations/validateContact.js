import validator from 'validator';

export function validateContact({ name, email, description }) {
  const errors = {};
  //if (!name || name.trim().length < 2) errors.name = 'Name too short';
  if (!email || !validator.isEmail(email)) errors.email = 'Invalid email';
  if (!description || description.length < 6) errors.password = 'Description too short';
  return errors;
}
