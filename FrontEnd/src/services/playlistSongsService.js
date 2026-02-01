import api from './api';

const playlistSongsService = {
  getByPlaylist: (playlistId) => api.get(`/playlistSongs/${playlistId}`),
  create: (data) => api.post('/playlistSongs', data),
  update: (data) => api.put('/playlistSongs', data),
  delete: (playlistId, songId) => api.delete(`/playlistSongs/${playlistId}/song/${songId}`),
};

export default playlistSongsService;