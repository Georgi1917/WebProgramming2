import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import SongList from '../components/Songs/SongList';
import SongForm from '../components/Songs/SongForm';
import AudioPlayer from '../components/Songs/AudioPlayer';
import PlaylistSelector from '../components/Playlists/PlaylistSelector';
import songService from '../services/songService';
import userLikedSongsService from '../services/userLikedSongsService';
import { API_BASE_URL } from '../services/api';
import './CrudPage.css';

function SongsPage() {
  const { requireLogin, setShowLoginModal, isAuthenticated, user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [likedSongIds, setLikedSongIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', durationInSeconds: 0, albumId: 0 });
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);

  // debug logging removed

  useEffect(() => {
    fetchSongs();
    if (isAuthenticated && user?.id) {
      fetchLikedSongs();
    }
  }, [isAuthenticated, user?.id]);

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

  const fetchLikedSongs = async () => {
    try {
      const res = await userLikedSongsService.getLikedByUser(user.id);
      const likedIds = res.data?.map(uls => uls.song?.id || uls.songId) || [];
      setLikedSongIds(likedIds);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
    }
  };

  const handleAdd = () => {
    if (!requireLogin(() => handleAdd())) return;
    
    setEditingId(null);
    setFormData({ title: '', durationInSeconds: 0, albumId: 0, genreId: null });
    setShowForm(true);
  };

  const handleEdit = (song) => {
    if (!requireLogin(() => handleEdit(song))) return;
    
    setEditingId(song.id);
    setFormData({ 
      title: song.title, 
      durationInSeconds: song.durationInSeconds,
      albumId: song.albumId,
      genreId: song.genreId || (song.genre ? song.genre.id : null)
    });
    setShowForm(true);
  };
    
  const handleDelete = async (id) => {
    if (!requireLogin(() => handleDelete(id))) return;
    
    if (window.confirm('Are you sure?')) {
      try {
        // If the deleted song is currently playing, stop and clear the player
        if (id === currentSongId) {
          if (audioRef.current) {
            try { audioRef.current.pause(); } catch (e) {}
            try { audioRef.current.removeAttribute('src'); audioRef.current.load(); } catch (e) {}
          }
          setIsPlaying(false);
          setCurrentSongId(null);
        }

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
        if (data.genreId) formDataToSend.append('genreId', data.genreId);
        
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

  const handleOpenPlaylistSelector = (songId) => {
    if (!requireLogin(() => handleOpenPlaylistSelector(songId))) return;
    setSelectedSongId(songId);
    setShowPlaylistSelector(true);
  };

  const handlePlaylistSelectorSuccess = () => {
    setShowPlaylistSelector(false);
  };

  const handleLike = async (songId) => {
    if (!requireLogin(() => handleLike(songId))) return;
    try {
      await userLikedSongsService.addLike({
        userId: user.id,
        songId: songId
      });
      setLikedSongIds([...likedSongIds, songId]);
    } catch (error) {
      console.error('Error liking song:', error);
      alert('Failed to like song');
    }
  };

  const handleUnlike = async (songId) => {
    if (!requireLogin(() => handleUnlike(songId))) return;
    try {
      await userLikedSongsService.removeLike(user.id, songId);
      setLikedSongIds(likedSongIds.filter(id => id !== songId));
    } catch (error) {
      console.error('Error unliking song:', error);
      alert('Failed to unlike song');
    }
  };

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>🎵 Songs</h1>
        {user?.role === 'Admin' && (
          <button onClick={handleAdd} className="btn-primary">+ Add Song</button>
        )}
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
            onEdit={user?.role === 'Admin' ? handleEdit : null}
            onDelete={user?.role === 'Admin' ? handleDelete : null}
            onPlay={togglePlay}
            onAddToPlaylist={(songId) => handleOpenPlaylistSelector(songId)}
            onLike={handleLike}
            onUnlike={handleUnlike}
            likedSongIds={likedSongIds}
            currentSongId={currentSongId}
            isPlaying={isPlaying}
            isAdmin={user?.role === 'Admin'}
          />
        </>
      )}

      {showPlaylistSelector && selectedSongId && (
        <PlaylistSelector
          songId={selectedSongId}
          onClose={() => setShowPlaylistSelector(false)}
          onSuccess={handlePlaylistSelectorSuccess}
        />
      )}

      <audio ref={audioRef} onEnded={() => { setIsPlaying(false); setCurrentSongId(null); }} />
    </div>
  );
}

export default SongsPage;
