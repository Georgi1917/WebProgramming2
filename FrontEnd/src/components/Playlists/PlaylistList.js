import React from 'react';
import './CrudList.css';

function PlaylistList({ playlists, onEdit, onDelete }) {
  if (playlists.length === 0) {
    return <p className="empty-message">No playlists found. Create one to get started!</p>;
  }

  return (
    <div className="table-container">
      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map(playlist => (
            <tr key={playlist.id}>
              <td>{playlist.id}</td>
              <td>{playlist.name}</td>
              <td>{playlist.description}</td>
              <td>
                <button onClick={() => onEdit(playlist)} className="btn-edit">Edit</button>
                <button onClick={() => onDelete(playlist.id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlaylistList;