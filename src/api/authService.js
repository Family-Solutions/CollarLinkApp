import apiClient from './axiosConfig';

const register = (username, password) => {
  // el rol siempre sera user
  const roles = ['ROLE_USER']; 
  return apiClient.post('/authentication/sign-up', {
    username,
    password,
    roles,
  });
};

const login = (username, password) => {
  return apiClient.post('/authentication/sign-in', {
    username,
    password,
  });
};

const authService = {
  register,
  login,
};

export default authService;