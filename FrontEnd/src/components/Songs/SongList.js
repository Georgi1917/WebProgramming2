import React, { useState, useRef } from 'react';
import '../Playlists/CrudList.css';
import './SongList.css';

function SongList({ songs, onEdit, onDelete }) {
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  if (songs.length === 0) {
    return <p className="empty-message">No songs found. Upload one to get started!</p>;
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = (song) => {
    if (playingId === song.id) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
    } else {
      // Play
      if (audioRef.current) {
        audioRef.current.src = `https://localhost:7152/api/songs/stream/${song.id}`;
        audioRef.current.play();
      }
      setPlayingId(song.id);
    }
  };

  const handleAudioEnd = () => {
    setPlayingId(null);
  };

  return (
    <>
      <audio ref={audioRef} onEnded={handleAudioEnd} />
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
                <td>{formatDuration(song.durationInSeconds)}</td>
                <td>
                  <div className="song-actions">
                    <button onClick={() => handlePlay(song)} className="btn-play">
                      {playingId === song.id ? '⏸ Pause' : '▶ Play'}
                    </button>
                    <button onClick={() => onEdit(song)} className="btn-edit">Edit</button>
                    <button onClick={() => onDelete(song.id)} className="btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SongList;
