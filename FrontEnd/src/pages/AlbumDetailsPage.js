import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import albumService from '../services/albumService';
import songService from '../services/songService';
import userLikedSongsService from '../services/userLikedSongsService';
import { API_BASE_URL } from '../services/api';
import SongForm from '../components/Songs/SongForm';
import AudioPlayer from '../components/Songs/AudioPlayer';
import PlaylistSelector from '../components/Playlists/PlaylistSelector';
import './CrudPage.css';
import './AlbumDetailsPage.css';

function AlbumDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireLogin, isAuthenticated, user } = useAuth();

  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [likedSongIds, setLikedSongIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const audioRef = useRef(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [genreMap, setGenreMap] = useState({});

  useEffect(() => {
    fetchAlbumAndSongs();
    if (isAuthenticated && user?.id) {
      fetchLikedSongs();
    }
    // fetch genres for display
    (async () => {
      try {
        const res = await (await import('../services/genreService')).default.getAll();
        const raw = res.data || [];
        const normalized = raw.map(g => ({ id: g.id ?? g.Id ?? g.ID, name: g.name ?? g.Name }));
        const map = {};
        normalized.forEach(g => { if (g.id != null) map[g.id] = g.name; });
        setGenreMap(map);
      } catch (e) {
        console.error('Failed to load genres', e);
      }
    })();
  }, [id, isAuthenticated, user?.id]);

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

  const fetchLikedSongs = async () => {
    try {
      const res = await userLikedSongsService.getLikedByUser(user.id);
      const likedIds = res.data?.map(uls => uls.song?.id || uls.songId) || [];
      setLikedSongIds(likedIds);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
    }
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
      // If the deleted song is currently playing, stop and clear the player
      if (songId === currentSongId) {
        if (audioRef.current) {
          try { audioRef.current.pause(); } catch (e) {}
          try { audioRef.current.removeAttribute('src'); audioRef.current.load(); } catch (e) {}
        }
        setIsPlaying(false);
        setCurrentSongId(null);
      }

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
        // Update on server
        await songService.update(editingSong.id, formData);
        // Update local state to reflect changes immediately without refetching
        setSongs(songs.map(s => 
          s.id === editingSong.id 
            ? { ...s, ...formData }
            : s
        ));
        setShowForm(false);
      } else {
        // For creation, refetch to get the new song
        const fd = new FormData();
        if (file) fd.append('file', file);
        fd.append('Title', formData.title);
        fd.append('DurationInSeconds', String(formData.durationInSeconds));
        fd.append('AlbumId', String(formData.albumId));
        if (formData.genreId) fd.append('GenreId', String(formData.genreId));
        await songService.create(fd);
        await fetchAlbumAndSongs();
        setShowForm(false);
      }
    } catch (err) {
      console.error('Failed to save song', err);
      alert('Failed to save song');
    }
  };

  const handleOpenPlaylistSelector = (songId) => {
    if (!requireLogin(() => handleOpenPlaylistSelector(songId))) return;
    setSelectedSongId(songId);
    setShowPlaylistSelector(true);
  };

  const handlePlaylistSelectorSuccess = () => {
    // Refresh the page if needed or just close the modal
    setShowPlaylistSelector(false);
  };

  const handleLike = async (songId) => {
    if (!requireLogin(() => handleLike(songId))) return;
    try {
      await userLikedSongsService.addLike({ userId: user.id, songId });
      setLikedSongIds([...likedSongIds, songId]);
    } catch (error) {
      console.error('Failed to like song', error);
      alert('Failed to like song');
    }
  };

  const handleUnlike = async (songId) => {
    if (!requireLogin(() => handleUnlike(songId))) return;
    try {
      await userLikedSongsService.removeLike(user.id, songId);
      setLikedSongIds(likedSongIds.filter(id => id !== songId));
    } catch (error) {
      console.error('Failed to unlike song', error);
      alert('Failed to unlike song');
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
          {user?.role === 'Admin' && (
            <button onClick={handleCreateSong} className="btn-primary">+ Add Song</button>
          )}
        </div>

        {showForm && (
          <SongForm
            initialData={editingSong}
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
                  <th>Genre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {songs.map(song => (
                  <tr key={song.id}>
                    <td>{song.id}</td>
                    <td>{song.title}</td>
                    <td>{song.genre?.name || song.genre?.Name || song.genreName || (song.genreId ? genreMap[song.genreId] : null) || song.genreId || 'N/A'}</td>
                    <td>
                      <button onClick={() => togglePlay(song)} className="btn-details">{currentSongId === song.id && isPlaying ? 'Pause' : 'Play'}</button>
                      <button onClick={() => handleOpenPlaylistSelector(song.id)} className="btn-add-playlist" title="Add to Playlist">➕</button>
                      <button
                        onClick={() => likedSongIds.includes(song.id) ? handleUnlike(song.id) : handleLike(song.id)}
                        className="btn-like"
                        title={likedSongIds.includes(song.id) ? 'Unlike' : 'Like'}
                      >
                        {likedSongIds.includes(song.id) ? '❤️' : '🤍'}
                      </button>
                      {user?.role === 'Admin' && <button onClick={() => handleEditSong(song)} className="btn-edit">Edit</button>}
                      {user?.role === 'Admin' && <button onClick={() => handleDeleteSong(song.id)} className="btn-delete">Delete</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <audio ref={audioRef} onEnded={() => { setIsPlaying(false); setCurrentSongId(null); }} />

      {showPlaylistSelector && selectedSongId && (
        <PlaylistSelector
          songId={selectedSongId}
          onClose={() => setShowPlaylistSelector(false)}
          onSuccess={handlePlaylistSelectorSuccess}
        />
      )}
    </div>
  );
}

export default AlbumDetailsPage;
