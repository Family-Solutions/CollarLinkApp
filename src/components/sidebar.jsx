// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Importando los iconos que usaremos
import { FaMapMarkedAlt, FaPaw } from 'react-icons/fa';

const navItems = [
  { to: '/dashboard', icon: <FaMapMarkedAlt />, text: 'Localización' }
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay que oscurece el fondo cuando el sidebar está abierto */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={toggleSidebar}
      ></div>

      {/* El contenido del Sidebar */}
      <nav className={`sidebar-nav ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menú</h3>
        </div>
        <ul className="sidebar-menu">
          {navItems.map((item, index) => (
            <li key={index} className="sidebar-menu-item">
              <Link 
                to={item.to} 
                className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
                onClick={toggleSidebar} // Cierra el sidebar al hacer clic en un enlace
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;