import React, { useState, useEffect } from 'react';
import './SongForm.css';

function SongForm({ initialData, albumId, onSubmit, onCancel, isEditing }) {
  const [formData, setFormData] = useState({
    title: '',
    durationInSeconds: '',
    albumId: albumId
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        durationInSeconds: initialData.durationInSeconds || '',
        albumId: initialData.albumId || albumId
      });
    } else {
      setFormData({ title: '', durationInSeconds: '', albumId: albumId });
    }
  }, [initialData, albumId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.durationInSeconds === '') {
      alert('Please fill in all fields');
      return;
    }
    const payload = {
      title: formData.title,
      durationInSeconds: parseInt(formData.durationInSeconds, 10),
      albumId: formData.albumId
    };
    onSubmit(payload, file);
  };

  return (
    <div className="form-overlay" onClick={onCancel}>
      <div className="form-container" onClick={e => e.stopPropagation()}>
        <h2>{isEditing ? 'Edit Song' : 'Create New Song'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={formData.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="durationInSeconds">Duration (seconds)</label>
            <input id="durationInSeconds" name="durationInSeconds" type="number" min="0" value={formData.durationInSeconds} onChange={handleChange} />
          </div>
          {!isEditing && (
            <div className="form-group">
              <label htmlFor="file">Song File</label>
              <input id="file" name="file" type="file" accept="audio/*" onChange={e => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
              <small>Supported formats: MP3, WAV, AAC</small>
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn-submit">{isEditing ? 'Update Song' : 'Create Song'}</button>
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SongForm;
