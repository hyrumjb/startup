import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ userName, authState, onAuthChange }) {
  return (
    <main class="container-fluid bg-secondary text-center">
        {authState !== AuthState.Unknown && <h1>Welcome to myDinero</h1>}
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
        {/* <form method="get" action="play.html">
            <div class="input-group mb-3">
                <span class="input-group-text">Username</span>
                <input class="form-control" type="text" placeholder="example123" />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text">Password</span>
                <input class="form-control" type="password" placeholder="password456" />
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
            <button type="submit" class="btn btn-secondary">Create Account</button>
        </form> */}
    </main>
  );
}