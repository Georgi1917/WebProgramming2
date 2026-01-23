import React, { useState, useEffect } from 'react';
import ArtistList from '../components/Artists/ArtistList';
import ArtistForm from '../components/Artists/ArtistForm';
import artistService from '../services/artistService';
import './CrudPage.css';

function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', genre: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const response = await artistService.getAll();
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '', country: '' });
    setShowForm(true);
  };

  const handleEdit = (artist) => {
    setEditingId(artist.id);
    setFormData({ name: artist.name, country: artist.country });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await artistService.delete(id);
        fetchArtists();
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingId) {
        await artistService.update(editingId, data);
      } else {
        await artistService.create(data);
      }
      fetchArtists();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving artist:', error);
    }
  };

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>🎤 Artists</h1>
        <button onClick={handleAdd} className="btn-primary">+ Add Artist</button>
      </div>

      {showForm && (
        <ArtistForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isEditing={!!editingId}
        />
      )}

      {loading ? <p>Loading...</p> : (
        <ArtistList
          artists={artists}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ArtistsPage;