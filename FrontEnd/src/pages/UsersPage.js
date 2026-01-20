import React, { useState, useEffect } from 'react';
import UserList from '../components/Users/UserList';
import UserForm from '../components/Users/UserForm';
import userService from '../services/userService';
import './CrudPage.css';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ username: '', email: '', password: '' });
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({ username: user.username, email: user.email });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await userService.delete(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingId) {
        await userService.update(editingId, data);
      } else {
        await userService.create(data);
      }
      fetchUsers();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>👥 Users</h1>
        <button onClick={handleAdd} className="btn-primary">+ Add User</button>
      </div>

      {showForm && (
        <UserForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isEditing={!!editingId}
        />
      )}

      {loading ? <p>Loading...</p> : (
        <UserList
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default UsersPage;