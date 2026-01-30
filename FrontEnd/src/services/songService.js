import api from './api';

const songService = {
  getAll: () => api.get('/songs'),
  getById: (id) => api.get(`/songs/${id}`),
  create: (formData) => api.post('/songs', formData),
  update: (id, data) => api.put(`/songs/${id}`, data),
  delete: (id) => api.delete(`/songs/${id}`),
};

export default songService;
