import React from 'react';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Si no está autenticado, lo redirigimos a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>¡Bienvenido, {user.username}!</h1>
      <p>Este es tu panel de control.</p>
      <p>Próximamente aquí verás el mapa y la información de tus mascotas.</p>
    </div>
  );
};

export default Dashboard;