import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import playlistSongsService from '../services/playlistSongsService';
import AudioPlayer from '../components/Songs/AudioPlayer';
import { API_BASE_URL } from '../services/api';
import './CrudPage.css';

function PlaylistDetailsPage() {
  const { id } = useParams();
  const { requireLogin, setShowLoginModal } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSongs = async () => {
    if (!requireLogin(() => fetchSongs())) return;
    setLoading(true);
    try {
      const res = await playlistSongsService.getByPlaylist(id);
      setSongs(res.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error('Error fetching playlist songs:', error);
      }
    }
    setLoading(false);
  };

  const togglePlay = (song) => {
    if (currentSongId === song.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = `${API_BASE_URL}/songs/stream/${song.id}`;
      audioRef.current.play();
      setCurrentSongId(song.id);
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentSongId(null);
      setCurrentSong(null);
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef]);

  const handleRemoveSong = async (playlistId, songId) => {
    if (!requireLogin(() => handleRemoveSong(playlistId, songId))) return;
    
    if (window.confirm('Remove this song from the playlist?')) {
      try {
        // If the removed song is currently playing, stop and clear the player
        if (songId === currentSongId) {
          if (audioRef.current) {
            try { audioRef.current.pause(); } catch (e) {}
          }
          setIsPlaying(false);
          setCurrentSongId(null);
          setCurrentSong(null);
        }
        await playlistSongsService.delete(playlistId, songId);
        fetchSongs();
      } catch (error) {
        console.error('Error removing song:', error);
      }
    }
  };

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>🎶 Playlist Songs</h1>
        <p>Playlist ID: {id}</p>
      </div>

      <audio ref={audioRef} />

      {loading ? <p>Loading...</p> : (
        songs.length === 0 ? <p>No songs in this playlist.</p> : (
          <div className="table-container">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Song ID</th>
                  <th>Title</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((ps, index) => (
                  <tr key={ps.song?.id || `song-${index}`}>
                    <td>{ps.song?.id}</td>
                    <td>{ps.song?.title}</td>
                    <td>{ps.position}</td>
                    <td>
                      <button onClick={() => togglePlay(ps.song)} className="btn-play">
                        {currentSongId === ps.song?.id && isPlaying ? '⏸ Pause' : '▶ Play'}
                      </button>
                      <button onClick={() => handleRemoveSong(id, ps.songId)} className="btn-delete">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {currentSongId && currentSong && (
        <AudioPlayer audioRef={audioRef} song={currentSong} currentSongId={currentSongId} isPlaying={isPlaying} onTogglePlay={togglePlay} />
      )}
    </div>
  );
}

export default PlaylistDetailsPage;
