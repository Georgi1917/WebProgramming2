import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ArtistList from '../components/Artists/ArtistList';
import ArtistForm from '../components/Artists/ArtistForm';
import artistService from '../services/artistService';
import './CrudPage.css';

function ArtistsPage() {
  const navigate = useNavigate();
  const { requireLogin, user } = useAuth();
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
    if (!requireLogin(() => handleAdd())) return;
    
    setEditingId(null);
    setFormData({ name: '', country: '' });
    setShowForm(true);
  };

  const handleEdit = (artist) => {
    if (!requireLogin(() => handleEdit(artist))) return;
    
    setEditingId(artist.id);
    setFormData({ name: artist.name, country: artist.country });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!requireLogin(() => handleDelete(id))) return;
    
    if (window.confirm('Are you sure?')) {
      try {
        await artistService.delete(id);
        fetchArtists();
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
    }
  };

  const handleDetails = (artist) => {
    navigate(`/artists/${artist.id}`);
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
        {user?.role === 'Admin' && (
          <button onClick={handleAdd} className="btn-primary">+ Add Artist</button>
        )}
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
          onEdit={user?.role === 'Admin' ? handleEdit : null}
          onDelete={user?.role === 'Admin' ? handleDelete : null}
          onDetails={handleDetails}
          isAdmin={user?.role === 'Admin'}
        />
      )}
    </div>
  );
}

export default ArtistsPage;