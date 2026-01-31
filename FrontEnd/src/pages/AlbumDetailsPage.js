import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import albumService from '../services/albumService';
import songService from '../services/songService';
import { API_BASE_URL } from '../services/api';
import SongForm from '../components/Songs/SongForm';
import AudioPlayer from '../components/Songs/AudioPlayer';
import './CrudPage.css';
import './AlbumDetailsPage.css';

function AlbumDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireLogin } = useAuth();

  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const audioRef = useRef(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchAlbumAndSongs();
  }, [id]);

  const fetchAlbumAndSongs = async () => {
    setLoading(true);
    setError(null);
    try {
      const albumResp = await albumService.getById(id);
      setAlbum(albumResp.data);

      const songsResp = await songService.getAll();
      const albumSongs = songsResp.data.filter(s => s.albumId === parseInt(id));
      setSongs(albumSongs);
    } catch (err) {
      console.error(err);
      setError('Failed to load album or songs');
    }
    setLoading(false);
  };

  const handleCreateSong = () => {
    if (!requireLogin(() => handleCreateSong())) return;
    setEditingSong(null);
    setShowForm(true);
  };

  const handleEditSong = (song) => {
    if (!requireLogin(() => handleEditSong(song))) return;
    setEditingSong(song);
    setShowForm(true);
  };

  const handleDeleteSong = async (songId) => {
    if (!requireLogin(() => handleDeleteSong(songId))) return;
    if (!window.confirm('Are you sure you want to delete this song?')) return;
    try {
      await songService.delete(songId);
      await fetchAlbumAndSongs();
    } catch (err) {
      console.error('Failed to delete song', err);
      alert('Failed to delete song');
    }
  };

  const togglePlay = async (song) => {
    if (!audioRef.current) return;

    const url = `${API_BASE_URL}/songs/stream/${song.id}`;

    if (currentSongId !== song.id) {
      // load new song
      try {
        audioRef.current.pause();
        audioRef.current.src = url;
        audioRef.current.load();
        await audioRef.current.play();
        setCurrentSongId(song.id);
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback failed', err);
        setIsPlaying(false);
      }
    } else {
      // same song: toggle
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.error('Playback failed', err);
        }
      }
    }
  };

  const handleSubmitSong = async (formData, file) => {
    try {
      if (editingSong) {
        await songService.update(editingSong.id, formData);
      } else {
        // create with multipart form data
        const fd = new FormData();
        if (file) fd.append('file', file);
        fd.append('Title', formData.title);
        fd.append('DurationInSeconds', String(formData.durationInSeconds));
        fd.append('AlbumId', String(formData.albumId));
        await songService.create(fd);
      }
      setShowForm(false);
      await fetchAlbumAndSongs();
    } catch (err) {
      console.error('Failed to save song', err);
      alert('Failed to save song');
    }
  };

  if (loading) return <div className="crud-page"><p className="loading-message">Loading...</p></div>;
  if (error || !album) return (
    <div className="crud-page">
      <button onClick={() => navigate(-1)} className="btn-back">← Back</button>
      <p className="error-message">{error || 'Album not found'}</p>
    </div>
  );

  return (
    <div className="crud-page">
      <div className="details-header">
        <button onClick={() => navigate(-1)} className="btn-back">← Back</button>
        <h1>💿 {album.title}</h1>
      </div>

      <div className="artist-info-card">
        <div className="info-section">
          <h3>Album Information</h3>
          <div className="info-item">
            <label>ID:</label>
            <span>{album.id}</span>
          </div>
          <div className="info-item">
            <label>Title:</label>
            <span>{album.title}</span>
          </div>
          <div className="info-item">
            <label>Release Date:</label>
            <span>{new Date(album.releaseDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="albums-section">
        <div className="albums-header">
          <h2>Songs</h2>
          <button onClick={handleCreateSong} className="btn-primary">+ Add Song</button>
        </div>

        {showForm && (
          <SongForm
            song={editingSong}
            albumId={parseInt(id)}
            onSubmit={handleSubmitSong}
            onCancel={() => setShowForm(false)}
            isEditing={!!editingSong}
          />
        )}

        {currentSongId && songs.find(s => s.id === currentSongId) && (
          <AudioPlayer
            audioRef={audioRef}
            song={songs.find(s => s.id === currentSongId)}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            currentSongId={currentSongId}
          />
        )}

        {songs.length === 0 ? (
          <p className="empty-message">No songs for this album.</p>
        ) : (
          <div className="table-container">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {songs.map(song => (
                  <tr key={song.id}>
                    <td>{song.id}</td>
                    <td>{song.title}</td>
                    <td>{song.durationInSeconds ? `${Math.floor(song.durationInSeconds/60)}:${String(song.durationInSeconds%60).padStart(2,'0')}` : 'N/A'}</td>
                    <td>
                      <button onClick={() => togglePlay(song)} className="btn-details">{currentSongId === song.id && isPlaying ? 'Pause' : 'Play'}</button>
                      <button onClick={() => handleEditSong(song)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDeleteSong(song.id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <audio ref={audioRef} onEnded={() => { setIsPlaying(false); setCurrentSongId(null); }} />
    </div>
  );
}

export default AlbumDetailsPage;
