import api from './api';

// login
export const loginUser = (data) => {
  return api.post('/auth/login', data);
};

// register
export const registerUser = (data) => {
  return api.post('/auth/register', data);
};

// refresh
export const refreshToken = () => {
  return api.post('/auth/refresh');
};
