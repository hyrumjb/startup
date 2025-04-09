import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Finances } from './finances/finances';
import { Shared } from './shared/shared';
import { About } from './about/about';
import { AuthState } from './login/authState';
import { InvestNotifier } from './investmentNotifier.js';

function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    useEffect(() => {
        InvestNotifier.connect();
    }, []);

    return (
        <BrowserRouter>
            <div className="custom-bg">
                <header className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
                        <div className="col-md-6 d-flex align-items-center">
                            <h1 className="mb-0 text-black">myDinero</h1>
                        </div>
                        <div className="col-md-6 text-center d-none d-md-block">
                            <h6 className="mb-0 text-black">$ € £ ¥ ₺ ₱</h6>
                        </div>
                        <nav className="navbar sticky-top navbar-dark">
                            <menu className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                                <li className="nav-item"><NavLink className="nav-link active px-2 link-secondary" to="">Home</NavLink></li>
                                {authState == AuthState.Authenticated && (
                                    <li className="nav-item"><NavLink className="nav-link active px-2 link-secondary" to="finances">My Investments</NavLink></li>
                                )}
                                {authState == AuthState.Authenticated && (
                                    <li className="nav-item"><NavLink className="nav-link active px-2 link-secondary" to="shared">Shared Investments</NavLink></li>
                                )}
                                <li className="nav-item"><NavLink className="nav-link active px-2 link-secondary" to="about">About</NavLink></li>
                            </menu>
                        </nav>
                    </div>
                    <hr></hr>
                </header>

                <Routes>
                    <Route
                        path='/'
                        element={
                            <Login
                                userName={userName}
                                authState={authState}
                                onAuthChange={(userName, authState) => {
                                    setAuthState(authState);
                                    setUserName(userName);
                                }}
                            />
                            } 
                            exact 
                    />
                    <Route path='/finances' element={<Finances userName={userName} />} />
                    <Route path='/shared' element={<Shared />} />
                    <Route path='/about' element={<About />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>

                <footer className="bg-dark text-white-50">
                    <div className="container-fluid">
                        <hr />
                        <span className="text-reset">Hyrum Bradshaw</span>
                        <br />
                        <a className="text-reset" href="https://github.com/hyrumjb/startup">GitHub</a>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}

export default App;