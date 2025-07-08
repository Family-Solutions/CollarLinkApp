import apiClient from './axiosConfig';

const getGeofencesByUsername = (username) => {
  return apiClient.get(`/geofence/username/${username}`);
};

const createGeofence = (geofenceData) => {
  return apiClient.post('/geofence', geofenceData);
};

const deleteGeofence = (geofenceId) => {
  return apiClient.delete(`/geofence/${geofenceId}`);
};

// para mas tarde
// const deleteGeofence = (id) => {
//   return apiClient.delete(`/geofence/${id}`);
// };

const geofenceService = {
  getGeofencesByUsername,
  createGeofence,
  deleteGeofence,
};

export default geofenceService;