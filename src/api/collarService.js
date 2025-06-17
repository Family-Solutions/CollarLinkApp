import apiClient from './axiosConfig';

// ASUNCIÓN: El endpoint para obtener los collares de un usuario.
const getCollarsByUsername = (username) => {
  return apiClient.get(`/collar/username/${username}`);
};

// ASUNCIÓN: El endpoint para crear un nuevo collar.
const createCollar = (collarData) => {
  return apiClient.post('/collar', collarData);
};

const collarService = {
  getCollarsByUsername,
  createCollar,
};

export default collarService;