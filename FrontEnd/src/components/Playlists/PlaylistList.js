import React from 'react';
import { Link } from 'react-router-dom';
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
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map(playlist => (
            <tr key={playlist.id}>
              <td>{playlist.id}</td>
              <td>{playlist.title}</td>
              <td>
                <div className="actions-container">
                  <Link to={`/playlists/${playlist.id}`} className="btn-view-songs">
                    🎵 View Songs
                  </Link>
                  <div className="actions-right">
                    <button onClick={() => onEdit(playlist)} className="btn-edit">Edit</button>
                    <button onClick={() => onDelete(playlist.id)} className="btn-delete">Delete</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlaylistList;