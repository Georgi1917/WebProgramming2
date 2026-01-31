import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import artistService from '../services/artistService';
import albumService from '../services/albumService';
import AlbumForm from '../components/Albums/AlbumForm';
import './CrudPage.css';
import './ArtistDetailsPage.css';

function ArtistDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireLogin } = useAuth();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);

  useEffect(() => {
    fetchArtistAndAlbums();
  }, [id]);

  const fetchArtistAndAlbums = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch artist details
      const artistResponse = await artistService.getById(id);
      setArtist(artistResponse.data);

      // Fetch all albums and filter by artist
      const albumsResponse = await albumService.getAll();
      const artistAlbums = albumsResponse.data.filter(album => album.artistId === parseInt(id));
      setAlbums(artistAlbums);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load artist details');
    }
    setLoading(false);
  };

  const handleCreateAlbum = () => {
    if (!requireLogin(() => handleCreateAlbum())) return;
    setEditingAlbum(null);
    setShowForm(true);
  };

  const handleEditAlbum = (album) => {
    if (!requireLogin(() => handleEditAlbum(album))) return;
    setEditingAlbum(album);
    setShowForm(true);
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!requireLogin(() => handleDeleteAlbum(albumId))) return;
    
    if (window.confirm('Are you sure you want to delete this album?')) {
      try {
        await albumService.delete(albumId);
        await fetchArtistAndAlbums();
      } catch (error) {
        console.error('Error deleting album:', error);
        alert('Failed to delete album');
      }
    }
  };

  const handleSubmitAlbum = async (formData) => {
    try {
      if (editingAlbum) {
        await albumService.update(editingAlbum.id, formData);
      } else {
        await albumService.create(formData);
      }
      await fetchArtistAndAlbums();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving album:', error);
      alert('Failed to save album');
    }
  };

  if (loading) {
    return (
      <div className="crud-page">
        <p className="loading-message">Loading...</p>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="crud-page">
        <button onClick={() => navigate('/artists')} className="btn-back">← Back to Artists</button>
        <p className="error-message">{error || 'Artist not found'}</p>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <div className="details-header">
        <button onClick={() => navigate('/artists')} className="btn-back">← Back to Artists</button>
        <h1>🎤 {artist.name}</h1>
      </div>

      <div className="artist-info-card">
        <div className="info-section">
          <h3>Artist Information</h3>
          <div className="info-item">
            <label>ID:</label>
            <span>{artist.id}</span>
          </div>
          <div className="info-item">
            <label>Name:</label>
            <span>{artist.name}</span>
          </div>
          <div className="info-item">
            <label>Country:</label>
            <span>{artist.country || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="albums-section">
        <div className="albums-header">
          <h2>Albums</h2>
          <button onClick={handleCreateAlbum} className="btn-primary">+ Add Album</button>
        </div>
        
        {showForm && (
          <AlbumForm
            album={editingAlbum}
            artistId={parseInt(id)}
            onSubmit={handleSubmitAlbum}
            onCancel={() => setShowForm(false)}
            isEditing={!!editingAlbum}
          />
        )}

        {albums.length === 0 ? (
          <p className="empty-message">No albums found for this artist.</p>
        ) : (
          <div className="table-container">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Release Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {albums.map(album => (
                  <tr key={album.id}>
                    <td>{album.id}</td>
                    <td>{album.title}</td>
                    <td>{new Date(album.releaseDate).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => navigate(`/albums/${album.id}`)} className="btn-details">Songs</button>
                      <button onClick={() => handleEditAlbum(album)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDeleteAlbum(album.id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtistDetailsPage;
