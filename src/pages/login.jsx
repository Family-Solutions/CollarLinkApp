// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../api/authService';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await authService.login(username, password);
      const { token, id, username: loggedInUsername } = response.data;
      login({ id, username: loggedInUsername }, token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <AuthLayout title="Iniciar Sesión">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button">Ingresar</button>
      </form>
      <p className="redirect-link">
        ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;