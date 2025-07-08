import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

import MainLayout from './components/mainlayout';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Mascotas from './pages/mascotas';
import Dispositivos from './pages/dispositivos';
import Geocercas from './pages/geocercas';


// Componente para proteger el Layout principal
const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <MainLayout />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas (Login y Register) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas que usan el MainLayout */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mascotas" element={<Mascotas />} />
            <Route path="/dispositivos" element={<Dispositivos />} />
            <Route path="/geocercas" element={<Geocercas />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;