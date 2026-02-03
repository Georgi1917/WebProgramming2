import React from 'react';
import '../Playlists/CrudList.css';

function UserList({ users, onEdit, onDelete, isAdmin = false }) {
  if (users.length === 0) {
    return <p className="empty-message">No users found. Create one to get started!</p>;
  }

  return (
    <div className="table-container">
      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                {isAdmin && <button onClick={() => onEdit(user)} className="btn-edit">Edit</button>}
                {isAdmin && <button onClick={() => onDelete(user.id)} className="btn-delete">Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;