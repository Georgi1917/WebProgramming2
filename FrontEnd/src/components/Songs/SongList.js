import React from 'react';
import '../Playlists/CrudList.css';
import './SongList.css';

function SongList({ songs, onEdit, onDelete, onPlay, onAddToPlaylist, onLike, onUnlike, likedSongIds = [], currentSongId, isPlaying }) {
  if (songs.length === 0) {
    return <p className="empty-message">No songs found. Upload one to get started!</p>;
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="table-container">
      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map(song => (
            <tr key={song.id}>
              <td>{song.id}</td>
              <td>{song.title}</td>
              <td>{formatDuration(song.durationInSeconds)}</td>
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
                  <button onClick={() => onEdit(song)} className="btn-edit">Edit</button>
                  <button onClick={() => onDelete(song.id)} className="btn-delete">Delete</button>
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
