import api from './api';

const genreService = {
  getAll: () => api.get('/genres')
};

export default genreService;
