import React, { useState } from 'react';
import '../Playlists/CrudForm.css';

function UserForm({ initialData, onSubmit, onCancel, isEditing }) {
  const [formData, setFormData] = useState(() => {
    const init = { role: 'User', ...(initialData || {}) };
    if (init.role == null) init.role = 'User';
    return init;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-overlay">
      <form className="crud-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Edit User' : 'Create User'}</h2>
        
        <div className="form-group">
          <label>Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role || 'User'}
            onChange={handleChange}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {!isEditing && (
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing}
            />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-submit">Save</button>
          <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;