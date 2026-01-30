import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Welcome to Playlist Dashboard</h1>
      <div className="stats-grid">
        <Link to="/playlists" className="stat-card-link">
          <div className="stat-card">
            <h2>📝 Playlists</h2>
            <p>Manage your music playlists</p>
          </div>
        </Link>
        <Link to="/artists" className="stat-card-link">
          <div className="stat-card">
            <h2>🎤 Artists</h2>
            <p>Browse and manage artists</p>
          </div>
        </Link>
        <Link to="/users" className="stat-card-link">
          <div className="stat-card">
            <h2>👥 Users</h2>
            <p>Manage user accounts</p>
          </div>
        </Link>
        <Link to="/songs" className="stat-card-link">
          <div className="stat-card">
            <h2>🎵 Songs</h2>
            <p>Upload and manage songs</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;