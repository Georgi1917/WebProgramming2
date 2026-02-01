import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import LoginModal from './components/Auth/LoginModal';
import RegisterModal from './components/Auth/RegisterModal';
import Dashboard from './pages/Dashboard';
import PlaylistsPage from './pages/PlaylistsPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailsPage from './pages/ArtistDetailsPage';
import AlbumDetailsPage from './pages/AlbumDetailsPage';
import PlaylistDetailsPage from './pages/PlaylistDetailsPage';
import UsersPage from './pages/UsersPage';
import SongsPage from './pages/SongsPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <LoginModal />
        <RegisterModal />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistDetailsPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artists/:id" element={<ArtistDetailsPage />} />
            <Route path="/albums/:id" element={<AlbumDetailsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/songs" element={<SongsPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;