import React from 'react';
import '../Playlists/CrudList.css';
import './SongList.css';

function SongList({ songs, onEdit, onDelete, onPlay, currentSongId, isPlaying }) {
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
