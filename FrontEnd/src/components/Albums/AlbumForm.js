import React, { useState, useEffect } from 'react';
import './AlbumForm.css';

function AlbumForm({ album, artistId, onSubmit, onCancel, isEditing }) {
  const [formData, setFormData] = useState({
    title: '',
    releaseDate: '',
    artistId: artistId
  });

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title || '',
        releaseDate: album.releaseDate ? album.releaseDate.split('T')[0] : '',
        artistId: artistId
      });
    } else {
      setFormData({
        title: '',
        releaseDate: '',
        artistId: artistId
      });
    }
  }, [album, artistId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.releaseDate) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="form-overlay" onClick={onCancel}>
      <div className="form-container" onClick={e => e.stopPropagation()}>
        <h2>{isEditing ? 'Edit Album' : 'Create New Album'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Album Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter album title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="releaseDate">Release Date</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="artistId">Artist ID</label>
            <input
              type="number"
              id="artistId"
              name="artistId"
              value={formData.artistId}
              disabled
              className="disabled-input"
            />
            <small>Auto-filled with current artist</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {isEditing ? 'Update Album' : 'Create Album'}
            </button>
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AlbumForm;
