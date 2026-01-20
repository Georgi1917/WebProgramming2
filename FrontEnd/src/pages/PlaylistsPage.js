import React, { useState, useEffect } from 'react';
import PlaylistList from '../components/Playlists/PlaylistList';
import PlaylistForm from '../components/Playlists/PlaylistForm';
import playlistService from '../services/playlistService';
import './CrudPage.css';

function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await playlistService.getAll();
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setShowForm(true);
  };

  const handleEdit = (playlist) => {
    setEditingId(playlist.id);
    setFormData({ name: playlist.name, description: playlist.description });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await playlistService.delete(id);
        fetchPlaylists();
      } catch (error) {
        console.error('Error deleting playlist:', error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingId) {
        await playlistService.update(editingId, data);
      } else {
        await playlistService.create(data);
      }
      fetchPlaylists();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  };

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>📝 Playlists</h1>
        <button onClick={handleAdd} className="btn-primary">+ Add Playlist</button>
      </div>

      {showForm && (
        <PlaylistForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isEditing={!!editingId}
        />
      )}

      {loading ? <p>Loading...</p> : (
        <PlaylistList
          playlists={playlists}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default PlaylistsPage;