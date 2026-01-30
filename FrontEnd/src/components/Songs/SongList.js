import React from 'react';
import '../Playlists/CrudList.css';

function SongList({ songs, onEdit, onDelete }) {
  if (songs.length === 0) {
    return <p className="empty-message">No songs found. Upload one to get started!</p>;
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="table-container">
      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Duration</th>
            <th>File Name</th>
            <th>Size</th>
            <th>Album ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map(song => (
            <tr key={song.id}>
              <td>{song.id}</td>
              <td>{song.title}</td>
              <td>{formatDuration(song.durationInSeconds)}</td>
              <td>{song.fileName}</td>
              <td>{formatFileSize(song.size)}</td>
              <td>{song.albumId || 'N/A'}</td>
              <td>
                <button onClick={() => onEdit(song)} className="btn-edit">Edit</button>
                <button onClick={() => onDelete(song.id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SongList;
