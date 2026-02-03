import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import AudioPlayer from '../components/Songs/AudioPlayer';
import userLikedSongsService from '../services/userLikedSongsService';
import { API_BASE_URL } from '../services/api';
import './CrudPage.css';

function LikedSongsPage() {
  const { user, requireLogin, setShowLoginModal, isAuthenticated } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchLikedSongs();
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const fetchLikedSongs = async () => {
    if (!requireLogin(() => fetchLikedSongs())) return;
    setLoading(true);
    try {
      const res = await userLikedSongsService.getLikedByUser(user.id);
      setSongs(res.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error('Error fetching liked songs:', error);
      }
    }
    setLoading(false);
  };

  const togglePlay = (song) => {
    if (currentSongId === song.id) {
      // Same song: toggle pause/play
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // Different song: load and play
      audioRef.current.src = `${API_BASE_URL}/songs/stream/${song.id}`;
      audioRef.current.play();
      setCurrentSongId(song.id);
      setIsPlaying(true);
    }
  };

  const handleRemoveLike = async (songId) => {
    if (!requireLogin(() => handleRemoveLike(songId))) return;

    if (window.confirm('Remove from Liked Songs?')) {
      try {
        // If the removed song is currently playing, stop the player
        if (songId === currentSongId) {
          if (audioRef.current) {
            try { audioRef.current.pause(); } catch (e) {}
            try { audioRef.current.removeAttribute('src'); audioRef.current.load(); } catch (e) {}
          }
          setIsPlaying(false);
          setCurrentSongId(null);
        }

        await userLikedSongsService.removeLike(user.id, songId);
        fetchLikedSongs();
      } catch (error) {
        console.error('Error removing like:', error);
      }
    }
  };

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>❤️ Liked Songs</h1>
      </div>

      <audio ref={audioRef} onEnded={() => { setIsPlaying(false); setCurrentSongId(null); }} />

      {loading ? <p>Loading...</p> : (
        songs.length === 0 ? <p className="empty-message">No liked songs yet. Start liking songs!</p> : (
          <>
            {currentSongId && songs.find(s => s.song?.id === currentSongId) && (
              <AudioPlayer
                audioRef={audioRef}
                song={songs.find(s => s.song?.id === currentSongId).song}
                isPlaying={isPlaying}
                onTogglePlay={(song) => togglePlay(song)}
                currentSongId={currentSongId}
              />
            )}

            <div className="table-container">
              <table className="crud-table">
                <thead>
                  <tr>
                    <th>Song ID</th>
                    <th>Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((uls, index) => (
                    <tr key={uls.song?.id || `liked-${index}`}>
                      <td>{uls.song?.id}</td>
                      <td>{uls.song?.title}</td>
                        <td>
                        <button onClick={() => togglePlay(uls.song)} className="btn-details">
                          {currentSongId === uls.song?.id && isPlaying ? '⏸ Pause' : '▶ Play'}
                        </button>
                        <button onClick={() => handleRemoveLike(uls.song?.id)} className="btn-delete">Unlike</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default LikedSongsPage;
