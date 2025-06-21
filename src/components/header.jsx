// src/components/Header.jsx
import React from 'react';
import './Header.css';
import { useAuth } from '../context/AuthContext';

// Recibe la propiedad 'toggleSidebar'
const Header = ({ toggleSidebar }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        {/* El botón de menú ahora llama a toggleSidebar */}
        <button className="menu-button" onClick={toggleSidebar}>
          ☰
        </button>
        <span className="app-title">IoT Pet Tracker</span>
      </div>
      <div className="header-right">
        {isAuthenticated ? (
          <>
            <span className="welcome-message">Hola, {user.username}</span>
            <button onClick={logout} className="logout-button">Salir</button>
          </>
        ) : (
          <div className="profile-icon">👤</div>
        )}
      </div>
    </header>
  );
};

export default Header;