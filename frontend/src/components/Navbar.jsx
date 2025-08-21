import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function getRole() {
  const t = localStorage.getItem('token');
  if (!t) return null;
  try { return JSON.parse(atob(t.split('.')[1])).role; } catch { return null; }
}

function getUserName() {
  const t = localStorage.getItem('token');
  if (!t) return null;
  try { return JSON.parse(atob(t.split('.')[1])).username; } catch { return null; }
}

const MilitaryIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginRight: '12px' }}>
    <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" 
          fill="var(--color-primary)" stroke="var(--color-primary)" strokeWidth="1"/>
    <path d="M9 12L11 14L15 10" stroke="var(--color-bg-primary)" strokeWidth="2" 
          strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();
  const username = getUserName();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  const navButtonStyle = {
    color: 'var(--color-text-primary)',
    fontWeight: 500,
    fontSize: '0.95rem',
    textTransform: 'none',
    padding: '8px 16px',
    borderRadius: 'var(--radius-lg)',
    transition: 'var(--transition-normal)',
    position: 'relative',
    '&:hover': {
      backgroundColor: 'rgba(212, 175, 55, 0.1)',
      color: 'var(--color-primary)',
      transform: 'translateY(-1px)',
    },
    '&.active': {
      backgroundColor: 'rgba(212, 175, 55, 0.15)',
      color: 'var(--color-primary)',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '2px',
        background: 'var(--gradient-primary)',
        borderRadius: '1px',
      }
    }
  };

  const logoutButtonStyle = {
    ...navButtonStyle,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    color: '#E74C3C',
    border: '1px solid rgba(231, 76, 60, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(231, 76, 60, 0.2)',
      color: '#FF6B6B',
      transform: 'translateY(-1px)',
    }
  };

  return (
    <nav>
      <div>
        <div>
          <MilitaryIcon />
          <h1>
            <span>MILITARY ASSET</span>
            <span>MANAGEMENT</span>
          </h1>
        </div>

        <div>
          {role && (
            <>
              <Link to="/dashboard">
                📊 Dashboard
              </Link>
              <Link to="/purchases">
                🛒 Purchases
              </Link>
              <Link to="/transfers">
                🔄 Transfers
              </Link>
              {(role === 'Admin' || role === 'Commander') && (
                <Link to="/assignments">
                  📋 Assignments
                </Link>
              )}
              
              <div>
                <div>
                  {username ? username.charAt(0).toUpperCase() : role?.charAt(0) || 'U'}
                </div>
                <div>
                  <div>{username || 'User'}</div>
                  <div>{role}</div>
                </div>
              </div>
              
              <button type="button" onClick={logout}>
                🚪 Logout
              </button>
            </>
          )}
          {!role && (
            <Link to="/login">
              🔐 Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
