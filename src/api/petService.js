
import apiClient from './axiosConfig';

const getPetsByUsername = (username) => {
  return apiClient.get(`/pet/username/${username}`);
};

const createPet = (petData) => {
  return apiClient.post('/pet', petData);
};

const petService = {
  getPetsByUsername,
  createPet,
};

export default petService;