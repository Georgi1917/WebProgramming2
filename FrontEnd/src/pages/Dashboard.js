import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Welcome to Playlist Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h2>📝 Playlists</h2>
          <p>Manage your music playlists</p>
        </div>
        <div className="stat-card">
          <h2>🎤 Artists</h2>
          <p>Browse and manage artists</p>
        </div>
        <div className="stat-card">
          <h2>👥 Users</h2>
          <p>Manage user accounts</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;