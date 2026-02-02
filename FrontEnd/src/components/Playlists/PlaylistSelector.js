import React, { useState, useEffect } from 'react';
import playlistService from '../../services/playlistService';
import playlistSongsService from '../../services/playlistSongsService';
import './PlaylistSelector.css';

function PlaylistSelector({ songId, onClose, onSuccess }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await playlistService.getAll();
      setPlaylists(res.data || []);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError('Failed to load playlists');
    }
    setLoading(false);
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await playlistSongsService.create({
        playlistId,
        songId
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error adding song to playlist:', err);
      alert('Failed to add song to playlist. It may already be in this playlist.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add to Playlist</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {loading && <p>Loading playlists...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && playlists.length === 0 && (
            <p className="empty-message">No playlists found. Create one first!</p>
          )}
          {!loading && playlists.length > 0 && (
            <div className="playlist-list">
              {playlists.map(playlist => (
                <button
                  key={playlist.id}
                  className="playlist-item"
                  onClick={() => handleAddToPlaylist(playlist.id)}
                >
                  <span className="playlist-icon">📝</span>
                  <span className="playlist-name">{playlist.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaylistSelector;
