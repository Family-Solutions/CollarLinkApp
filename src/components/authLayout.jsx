import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;