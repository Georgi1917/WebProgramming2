import React, { useState } from 'react';
import '../Playlists/CrudForm.css';

function SongForm({ initialData, onSubmit, onCancel, isEditing }) {
  const [formData, setFormData] = useState(initialData);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // For editing, just send the updated metadata
      onSubmit(formData, null);
    } else {
      // For creating, we need the file
      if (!file) {
        alert('Please select a song file');
        return;
      }
      onSubmit(formData, file);
    }
  };

  return (
    <div className="form-overlay">
      <form className="crud-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Edit Song' : 'Upload Song'}</h2>
        
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Duration (seconds) *</label>
          <input
            type="number"
            name="durationInSeconds"
            value={formData.durationInSeconds}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Album ID *</label>
          <input
            type="number"
            name="albumId"
            value={formData.albumId}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        {!isEditing && (
          <div className="form-group">
            <label>Song File *</label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".mp3,.wav,.aac"
              required={!isEditing}
            />
            <small>Supported formats: MP3, WAV, AAC</small>
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

export default SongForm;
