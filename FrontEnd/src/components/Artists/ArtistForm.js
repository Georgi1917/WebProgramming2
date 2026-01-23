import React, { useState } from 'react';
import '../Playlists/CrudForm.css';

function ArtistForm({ initialData, onSubmit, onCancel, isEditing }) {
  const [formData, setFormData] = useState(initialData);

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
        <h2>{isEditing ? 'Edit Artist' : 'Create Artist'}</h2>
        
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">Save</button>
          <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ArtistForm;