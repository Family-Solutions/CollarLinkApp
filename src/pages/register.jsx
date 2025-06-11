// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../api/authService';
import { useAuth } from '../context/authContext';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('El nombre de usuario y la contraseña son obligatorios.');
      return;
    }

    try {
      // 1. Intentar registrar al usuario
      await authService.register(username, password);

      // 2. Si el registro es exitoso, iniciar sesión automáticamente
      const response = await authService.login(username, password);
      
      // 3. Guardar datos en el contexto
      const { token, id, username: loggedInUsername } = response.data;
      login({ id, username: loggedInUsername }, token);
      
      // 4. Redirigir al dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      setError('Error al registrar. El usuario ya puede existir o el servidor no responde.');
    }
  };

  return (
    <AuthLayout title="Crear Cuenta">
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
        <button type="submit" className="auth-button">Registrarse</button>
      </form>
      <p className="redirect-link">
        ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;