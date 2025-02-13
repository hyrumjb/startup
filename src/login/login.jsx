import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Login() {
  return (
    <main class="container-fluid bg-secondary text-center">
        <h1>Welcome to myDinero</h1>
        <form method="get" action="play.html">
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
        </form>
    </main>
  );
}