import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// SVG icons for roles and fields
const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm6-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v8z" fill="#fff"/></svg>
);
const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 17c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2s-2 .9-2 2v2c0 1.1.9 2 2 2zm6-7V7c0-2.76-2.24-5-5-5S8 4.24 8 7v3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm-6-5c1.66 0 3 1.34 3 3v3H9V7c0-1.66 1.34-3 3-3z" fill="#b0b8c1"/></svg>
);
const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4V4zm8 8l8-5H4l8 5zm0 2l-8-5v10h16V9l-8 5z" fill="#b0b8c1"/></svg>
);
const EyeIcon = ({ open }) => (
  open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 6a9.77 9.77 0 0 1 8.94 6A9.77 9.77 0 0 1 12 18a9.77 9.77 0 0 1-8.94-6A9.77 9.77 0 0 1 12 6zm0 2a7.77 7.77 0 0 0-7.06 4A7.77 7.77 0 0 0 12 16a7.77 7.77 0 0 0 7.06-4A7.77 7.77 0 0 0 12 8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="#000000"/></svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 6a9.77 9.77 0 0 1 8.94 6A9.77 9.77 0 0 1 12 18a9.77 9.77 0 0 1-8.94-6A9.77 9.77 0 0 1 12 6zm0 2a7.77 7.77 0 0 0-7.06 4A7.77 7.77 0 0 0 12 16a7.77 7.77 0 0 0 7.06-4A7.77 7.77 0 0 0 12 8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-7.07 4A7.77 7.77 0 0 1 12 16a7.77 7.77 0 0 1 7.07-4A7.77 7.77 0 0 1 12 8a7.77 7.77 0 0 1-7.07 4z" fill="#000000"/></svg>
  )
);
const PersonIcon = () => (
  <span>
    👲🏻
  </span>
);
const ShieldBlueIcon = () => (
    <span>
    👮🏼‍♂️
  </span>
);
const TruckIcon = () => (
    <span>
    👨🏼‍✈️
  </span>
);
const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="7" y="7" width="10" height="10" rx="2" fill="#4b3bbd"/><rect x="3" y="3" width="10" height="10" rx="2" fill="#b0b8c1"/></svg>
);

const demoRoles = [
  {
    key: 'admin',
    title: 'System Administrator',
    desc: 'Full system access and management privileges',
    badge: 'admin',
    icon: <PersonIcon />,
    email: 'admin',
    password: 'admin123',
    btnClass: 'admin',
    borderClass: 'admin',
  },
  {
    key: 'commander',
    title: 'Base Commander',
    desc: 'Command operations and strategic oversight',
    badge: 'base commander',
    icon: <ShieldBlueIcon />,
    email: 'cmdr',
    password: 'cmdr123',
    btnClass: 'commander',
    borderClass: 'commander',
  },
  {
    key: 'logistics',
    title: 'Logistics Officer',
    desc: 'Supply chain and inventory management',
    badge: 'logistics officer',
    icon: <TruckIcon />,
    email: 'logi',
    password: 'logi123',
    btnClass: 'logistics',
    borderClass: 'logistics',
  },
];

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      navigate('/dashboard', { replace: true });
    } catch (e) {
      setErr(e.message);
    }
  };

  // Modal close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('demo-modal-overlay')) {
      setShowDemo(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Fill credentials from modal
  const fillDemo = (email, password) => {
    setForm({ username: email, password });
    setShowDemo(false);
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <h1 className="login-title">
           Global Asset Registry
        </h1>
        <form onSubmit={submit} className="login-form">
          <div className="login-input-group">
            <label htmlFor="username" className="login-label">Username</label>
            <span className="login-input-icon">👤</span>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={onChange}
              required
              placeholder="officer@military.gov"
              className="login-input"
            />
          </div>
          <div className="login-input-group">
            <label htmlFor="password" className="login-label">Password</label>
            <span className="login-input-icon">🛡️</span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              required
              placeholder="Password"
              className="login-input"
            />
            <span className="login-input-eye" onClick={() => setShowPassword(v => !v)}><EyeIcon open={showPassword} /></span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <button type="submit" className="login-btn">
              🔒 Sign In Securely
            </button>
          </div>
          {err && <div className="login-error">{err}</div>}
        </form>
        <div className="login-divider">
          <span className="login-divider-label">DEMO ACCESS</span>
        </div>
        <button type="button" className="demo-btn" onClick={() => setShowDemo(true)}>
          <ShieldIcon /> Use Demo Credentials
        </button>
        <div className="login-support">
          Need assistance? <a href="https://github.com/yukesshwaran21/Military_Asset_Management_System">Contact IT Support</a>
        </div>
      </div>
      {showDemo && (
        <div className="demo-modal-overlay" onClick={handleOverlayClick}>
          <div className="demo-modal">
            <div className="demo-modal-header">
              <div className="demo-modal-title"><ShieldIcon /> Demo Credentials</div>
              <button className="demo-modal-close" onClick={() => setShowDemo(false)}>&times;</button>
            </div>
            <div className="demo-modal-desc">
              Select a role to test the system with pre-configured demo accounts. Click to apply credentials directly or copy them individually.
            </div>
            <div className="demo-roles">
              {demoRoles.map(role => (
                <div key={role.key} className={`demo-role-card ${role.borderClass}`}>
                  <div className="demo-role-header">
                    <span className="demo-role-icon">{role.icon}</span>
                    <span className="demo-role-title">{role.title}</span>
                    <span className="demo-role-badge">{role.badge}</span>
                  </div>
                  <div className="demo-role-desc">{role.desc}</div>
                  <div className="demo-cred-row">
                    <span className="demo-cred-icon">👤</span>
                    <span>{role.email}</span>
                    <button className="demo-cred-copy" title="Copy Email" onClick={() => copyToClipboard(role.email)}><CopyIcon /></button>
                  </div>
                  <div className="demo-cred-row">
                    <span className="demo-cred-icon">🛡️</span>
                    <span>{role.password}</span>
                    <button className="demo-cred-copy" title="Copy Password" onClick={() => copyToClipboard(role.password)}><CopyIcon /></button>
                  </div>
                  <button className={`demo-role-btn ${role.btnClass}`} onClick={() => fillDemo(role.email, role.password)}>
                    {role.icon} Use {role.title} Account
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
