import api from './api';

const playlistService = {
  getAll: () => api.get('/playlist'),
  getById: (id) => api.get(`/playlist/${id}`),
  create: (data) => api.post('/playlist', data),
  update: (id, data) => api.put(`/playlist/${id}`, data),
  delete: (id) => api.delete(`/playlist/${id}`),
};

export default playlistService;