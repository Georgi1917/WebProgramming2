import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link to="/" className="nav-item">
          📊 Dashboard
        </Link>
        <Link to="/playlists" className="nav-item">
          📝 Playlists
        </Link>
        <Link to="/artists" className="nav-item">
          🎤 Artists
        </Link>
        <Link to="/users" className="nav-item">
          👥 Users
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;