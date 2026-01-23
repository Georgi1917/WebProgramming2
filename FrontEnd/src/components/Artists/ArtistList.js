import React from 'react';
import '../Playlists/CrudList.css';

function ArtistList({ artists, onEdit, onDelete }) {
  if (artists.length === 0) {
    return <p className="empty-message">No artists found. Create one to get started!</p>;
  }

  return (
    <div className="table-container">
      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {artists.map(artist => (
            <tr key={artist.id}>
              <td>{artist.id}</td>
              <td>{artist.name}</td>
              <td>{artist.country || 'N/A'}</td>
              <td>
                <button onClick={() => onEdit(artist)} className="btn-edit">Edit</button>
                <button onClick={() => onDelete(artist.id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArtistList;