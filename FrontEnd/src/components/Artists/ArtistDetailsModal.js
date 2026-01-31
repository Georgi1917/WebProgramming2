import React, { useState, useEffect } from 'react';
import albumService from '../../services/albumService';
import './ArtistDetailsModal.css';

function ArtistDetailsModal({ artist, onClose }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, [artist.id]);

  const fetchAlbums = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await albumService.getAll();
      // Filter albums for this artist
      const artistAlbums = response.data.filter(album => album.artistId === artist.id);
      setAlbums(artistAlbums);
    } catch (err) {
      console.error('Error fetching albums:', err);
      setError('Failed to load albums');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{artist.name} - Albums</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {loading && <p className="loading-message">Loading albums...</p>}
          {error && <p className="error-message">{error}</p>}
          
          {!loading && albums.length === 0 && (
            <p className="empty-message">No albums found for this artist.</p>
          )}
          
          {!loading && albums.length > 0 && (
            <div className="albums-list">
              <table className="albums-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Release Date</th>
                  </tr>
                </thead>
                <tbody>
                  {albums.map(album => (
                    <tr key={album.id}>
                      <td>{album.id}</td>
                      <td>{album.title}</td>
                      <td>{new Date(album.releaseDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtistDetailsModal;
