import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PlaylistList from '../components/Playlists/PlaylistList';
import PlaylistForm from '../components/Playlists/PlaylistForm';
import playlistService from '../services/playlistService';
import './CrudPage.css';

function PlaylistsPage() {
  const { requireLogin, setShowLoginModal, isAuthenticated } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, [isAuthenticated]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await playlistService.getAll();
      setPlaylists(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error('Error fetching playlists:', error);
      }
    }
    setLoading(false);
  };

  const handleAdd = () => {
    if (!requireLogin(() => handleAdd())) return;
    
    setEditingId(null);
    setFormData({ title: '' });
    setShowForm(true);
  };

  const handleEdit = (playlist) => {
    if (!requireLogin(() => handleEdit(playlist))) return;
    
    setEditingId(playlist.id);
    setFormData({ title: playlist.title });
    setShowForm(true);
  };
    
  const handleDelete = async (id) => {
    
    if (!requireLogin(() => handleDelete(id))) return;
    
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