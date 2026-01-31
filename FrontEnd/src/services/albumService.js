import api from './api';

const albumService = {
  getAll: () => api.get('/albums'),
  getById: (id) => api.get(`/albums/${id}`),
  getByArtistId: (artistId) => api.get('/albums', { params: { artistId } }),
  create: (data) => api.post('/albums', data),
  update: (id, data) => api.put(`/albums/${id}`, data),
  delete: (id) => api.delete(`/albums/${id}`),
};

export default albumService;
