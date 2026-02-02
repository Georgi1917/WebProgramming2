import api from './api';

const userLikedSongsService = {
  getLikedByUser: (userId) => api.get(`/userLikedSongs/${userId}`),
  addLike: (data) => api.post('/userLikedSongs', data),
  removeLike: (userId, songId) => api.delete(`/userLikedSongs/${userId}/song/${songId}`),
};

export default userLikedSongsService;
