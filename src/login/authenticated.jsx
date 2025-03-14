import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './authenticated.css';

export function Authenticated(props) {
    const navigate = useNavigate();

    function logout() {
        fetch(`/api/auth/logout`, {
            method: 'delete',
        })
            .catch(() => {
                // Logout failed
            })
            .finally(() => {
                localStorage.removeItem('userName');
                props.onLogout();
            });
    }

    return (
        <div>
            <div className='playerName'>{props.userName}</div>
            <Button variant='primary' onClick={() => navigate('/finances')}>
                View Finances
            </Button>
            <Button variant='secondary' onClick={() => logout()}>
                Logout
            </Button>
        </div>
    );
}