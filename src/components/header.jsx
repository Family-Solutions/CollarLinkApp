// src/components/Header.jsx
import React from 'react';
import './Header.css';
import { useAuth } from '../context/authContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-button">☰</button>
        <span className="app-title">CollarLink</span>
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