import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <body className="custom-bg">
        <header className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
                <div className="col-md-6 d-flex align-items-center">
                    <h1 className="mb-0 text-light">myDinero</h1>
                </div>
                <div className="col-md-6 text-center d-none d-md-block">
                    <h6 className="mb-0 text-light">~ the simple money interface ~</h6>
                </div>
                <nav className="navbar sticky-top navbar-dark">
                    <menu className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                        <li className="nav-item"><a className="nav-link active px-2 link-secondary" href="index.html">Home</a></li>
                        <li className="nav-item"><a className="nav-link active px-2 link-secondary" href="finances.html">My Investments</a></li>
                        <li className="nav-item"><a className="nav-link active px-2 link-secondary" href="shared.html">Shared Investments</a></li>
                        <li className="nav-item"><a className="nav-link active px-2 link-secondary" href="about.html">About</a></li>
                    </menu>
                </nav>
            </div>
            <hr></hr>
        </header>

        <main className="container-fluid bg-secondary text-center">
            App components go here
        </main>

        <footer className="bg-dark text-white-50">
            <div className="container-fluid">
                <hr />
                <span className="text-reset">Hyrum Bradshaw</span>
                <br />
                <a className="text-reset" href="https://github.com/hyrumjb/startup">GitHub</a>
            </div>
        </footer>
    </body>
  )
}