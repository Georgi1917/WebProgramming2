import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SongList from '../components/Songs/SongList';
import SongForm from '../components/Songs/SongForm';
import songService from '../services/songService';
import './CrudPage.css';

function SongsPage() {
  const { requireLogin, setShowLoginModal, isAuthenticated } = useAuth();
  const [songs, setSongs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', durationInSeconds: 0, albumId: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, [isAuthenticated]);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const response = await songService.getAll();
      setSongs(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error('Error fetching songs:', error);
      }
    }
    setLoading(false);
  };

  const handleAdd = () => {
    if (!requireLogin(() => handleAdd())) return;
    
    setEditingId(null);
    setFormData({ title: '', durationInSeconds: 0, albumId: 0 });
    setShowForm(true);
  };

  const handleEdit = (song) => {
    if (!requireLogin(() => handleEdit(song))) return;
    
    setEditingId(song.id);
    setFormData({ 
      title: song.title, 
      durationInSeconds: song.durationInSeconds,
      albumId: song.albumId
    });
    setShowForm(true);
  };
    
  const handleDelete = async (id) => {
    if (!requireLogin(() => handleDelete(id))) return;
    
    if (window.confirm('Are you sure?')) {
      try {
        await songService.delete(id);
        fetchSongs();
      } catch (error) {
        console.error('Error deleting song:', error);
      }
    }
  };

  const handleSubmit = async (data, file) => {
    try {
      if (editingId) {
        // Update existing song
        await songService.update(editingId, data);
      } else {
        // Create new song with file upload
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('title', data.title);
        formDataToSend.append('durationInSeconds', data.durationInSeconds);
        formDataToSend.append('albumId', data.albumId);
        
        await songService.create(formDataToSend);
      }
      fetchSongs();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving song:', error);
      alert('Error saving song. Please check the console for details.');
    }
  };

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>🎵 Songs</h1>
        <button onClick={handleAdd} className="btn-primary">+ Add Song</button>
      </div>

      {showForm && (
        <SongForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isEditing={!!editingId}
        />
      )}

      {loading ? <p>Loading...</p> : (
        <SongList
          songs={songs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default SongsPage;
