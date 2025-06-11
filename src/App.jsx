// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import Header from './components/header';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente para rutas públicas (si ya estás logueado, te redirige al dashboard)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route 
            path="/login" 
            element={<PublicRoute><Login /></PublicRoute>} 
          />
          <Route 
            path="/register" 
            element={<PublicRoute><Register /></PublicRoute>} 
          />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
          />
          {/* Redirige la ruta raíz a login o dashboard según el estado de auth */}
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" />} 
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;