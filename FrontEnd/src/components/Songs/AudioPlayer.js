import React, { useState, useEffect } from 'react';
import './AudioPlayer.css';

function AudioPlayer({ audioRef, song, isPlaying, onTogglePlay, currentSongId }) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    // Set initial duration when audio loads
    updateDuration();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('canplay', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('canplay', updateDuration);
    };
  }, [audioRef, currentSongId]);

  const handleSeek = (e) => {
    if (audioRef.current && duration && isFinite(duration)) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return '🔇';
    if (volume < 0.33) return '🔈';
    if (volume < 0.66) return '🔉';
    return '🔊';
  };

  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const isCurrentSong = currentSongId === song.id;

  return (
    <div className={`audio-player ${isCurrentSong ? 'active' : ''}`}>
      <div className="player-info">
        <span className="song-title">{song.title}</span>
      </div>

      <div className="player-controls">
        <button 
          className="player-btn-play" 
          onClick={() => onTogglePlay(song)}
          title={isCurrentSong && isPlaying ? 'Pause' : 'Play'}
        >
          {isCurrentSong && isPlaying ? '⏸' : '▶'}
        </button>

        <div className="player-progress-container">
          <span className="player-time">{formatTime(currentTime)}</span>
          <div className="player-progress" onClick={handleSeek}>
            <div 
              className="player-progress-bar" 
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span className="player-time">{formatTime(duration)}</span>
        </div>

        <div className="player-volume-container">
          <span className="volume-icon">{getVolumeIcon()}</span>
          <input
            type="range"
            className="player-volume-slider"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
