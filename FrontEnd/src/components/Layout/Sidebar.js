import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

function Sidebar() {
  const { user } = useAuth();
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
        <Link to="/songs" className="nav-item">
          🎵 Songs
        </Link>
        {user?.role === 'Admin' && (
          <Link to="/users" className="nav-item">
            👥 Users
          </Link>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;