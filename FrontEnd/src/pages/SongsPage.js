import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import SongList from '../components/Songs/SongList';
import SongForm from '../components/Songs/SongForm';
import AudioPlayer from '../components/Songs/AudioPlayer';
import songService from '../services/songService';
import { API_BASE_URL } from '../services/api';
import './CrudPage.css';

function SongsPage() {
  const { requireLogin, setShowLoginModal, isAuthenticated } = useAuth();
  const [songs, setSongs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', durationInSeconds: 0, albumId: 0 });
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
        <>
          {currentSongId && songs.find(s => s.id === currentSongId) && (
            <AudioPlayer
              audioRef={audioRef}
              song={songs.find(s => s.id === currentSongId)}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              currentSongId={currentSongId}
            />
          )}
          <SongList
            songs={songs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPlay={togglePlay}
            currentSongId={currentSongId}
            isPlaying={isPlaying}
          />
        </>
      )}

      <audio ref={audioRef} onEnded={() => { setIsPlaying(false); setCurrentSongId(null); }} />
    </div>
  );
}

export default SongsPage;
