import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';
import { useNavigate } from 'react-router-dom';

export function Login({ userName, authState, onAuthChange }) {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedToken = localStorage.getItem('authToken');

    if (storedUserName && storedToken) {
      onAuthChange(storedUserName, AuthState.Authenticated);
    } else {
      onAuthChange (null, AuthState.Unauthenticated);
      localStorage.removeItem('userName');
      localStorage.removeItem('authToken');
    }
  }, [onAuthChange]);
  
  return (
    <main className="container-fluid bg-secondary text-center">
        <h1>Welcome to myDinero</h1>
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} onLogout={() => {
            localStorage.removeItem('userName');
            localStorage.removeItem('authToken');
            onAuthChange(null, AuthState.Unauthenticated);
            navigate('/');
          }} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
              navigate('/finances');
            }}
          />
        )}
    </main>
  );
}