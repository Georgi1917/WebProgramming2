import React, { useEffect, useState } from 'react';
import '../Playlists/CrudList.css';
import './SongList.css';
import genreService from '../../services/genreService';

function SongList({ songs, onEdit, onDelete, onPlay, onAddToPlaylist, onLike, onUnlike, likedSongIds = [], currentSongId, isPlaying, isAdmin = false }) {
  const isEmpty = !songs || songs.length === 0;

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const [genreMap, setGenreMap] = useState({});

  useEffect(() => {
    let mounted = true;
    const fetchGenres = async () => {
      try {
        const res = await genreService.getAll();
        const raw = res.data || [];
        const normalized = raw.map(g => ({ id: g.id ?? g.Id ?? g.ID, name: g.name ?? g.Name }));
        const map = {};
        normalized.forEach(g => { if (g.id != null) map[g.id] = g.name; });
        if (mounted) setGenreMap(map);
      } catch (err) {
        console.error('Failed to load genres for song list', err);
      }
    };
    fetchGenres();
    return () => { mounted = false; };
  }, []);

  const getGenreName = (song) => {
    if (!song) return 'N/A';
    return song.genre?.name || song.genre?.Name || song.genreName || genreMap[song.genreId] || song.genreId || 'N/A';
  };

  if (isEmpty) {
    return <p className="empty-message">No songs found. Upload one to get started!</p>;
  }

  return (
    <div className="table-container">
      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map(song => (
            <tr key={song.id}>
              <td>{song.id}</td>
              <td>{song.title}</td>
              <td>{getGenreName(song)}</td>
                <td>
                <div className="song-actions">
                  <button onClick={() => onPlay(song)} className="btn-details">
                    {currentSongId === song.id && isPlaying ? '⏸ Pause' : '▶ Play'}
                  </button>
                  <button 
                    onClick={() => likedSongIds.includes(song.id) ? onUnlike?.(song.id) : onLike?.(song.id)}
                    className="btn-like"
                    title={likedSongIds.includes(song.id) ? 'Unlike' : 'Like'}
                  >
                    {likedSongIds.includes(song.id) ? '❤️' : '🤍'}
                  </button>
                  <button onClick={() => onAddToPlaylist?.(song.id)} className="btn-add-playlist" title="Add to Playlist">➕</button>
                  {isAdmin && <button onClick={() => onEdit(song)} className="btn-edit">Edit</button>}
                  {isAdmin && <button onClick={() => onDelete(song.id)} className="btn-delete">Delete</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SongList;
