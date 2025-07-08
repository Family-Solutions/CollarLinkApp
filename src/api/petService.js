
import apiClient from './axiosConfig';

const getPetsByUsername = (username) => {
  return apiClient.get(`/pet/username/${username}`);
};

const createPet = (petData) => {
  return apiClient.post('/pet', petData);
};

const deletePet = (petId) => {
  return apiClient.delete(`/pet/${petId}`);
};

const petService = {
  getPetsByUsername,
  createPet,
  deletePet,
};

export default petService;