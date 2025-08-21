import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const demoRoles = [
  {
    key: 'admin',
    title: 'System Administrator',
    desc: 'Full system access and management privileges',
    badge: 'admin',
    email: 'admin',
    password: 'admin123'
  },
  {
    key: 'commander',
    title: 'Base Commander',
    desc: 'Command operations and strategic oversight',
    badge: 'base commander',
    email: 'cmdr',
    password: 'cmdr123'
  },
  {
    key: 'logistics',
    title: 'Logistics Officer',
    desc: 'Supply chain and inventory management',
    badge: 'logistics officer',
    email: 'logi',
    password: 'logi123'
  }
];

// Particle system component
const ParticleSystem = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const createParticles = () => {
      const container = particlesRef.current;
      if (!container) return;

      // Clear existing particles
      container.innerHTML = '';

      // Create 20 particles
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        container.appendChild(particle);
      }
    };

    createParticles();
    const interval = setInterval(createParticles, 10000);

    return () => clearInterval(interval);
  }, []);

  return <div ref={particlesRef} className="particles" />;
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [biometricActive, setBiometricActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      navigate('/dashboard', { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.tagName === 'SECTION') {
      setIsVisible(false);
    }
  };

  const handleDemoLogin = (email, pass) => {
    setUsername(email);
    setPassword(pass);
    setIsVisible(false);
  };

  const handleBiometricScan = () => {
    setBiometricActive(true);
    setTimeout(() => setBiometricActive(false), 2000);
    // Simulate biometric authentication
    setTimeout(() => {
      setUsername('admin');
      setPassword('admin123');
    }, 1500);
  };

  return (
    <div className="login-container">
      <ParticleSystem />
      <main>
        <section className="login-section">
          <h1>SECURE ACCESS</h1>
          <div className="military-badge">CLASSIFIED SYSTEM</div>
          <div className="security-level">
            <span>SECURITY LEVEL:</span>
            <div className="security-dots">
              <div className="security-dot"></div>
              <div className="security-dot"></div>
              <div className="security-dot"></div>
              <div className="security-dot"></div>
              <div className="security-dot"></div>
            </div>
            <span>MAXIMUM</span>
          </div>
          <p>Military Asset Management System</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username / Email</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your credentials"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div 
                className={`biometric-scanner ${biometricActive ? 'active' : ''}`}
                onClick={handleBiometricScan}
                title="Biometric Authentication"
              ></div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Security Passphrase</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your secure passphrase"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
              <div className="biometric-scanner" title="Fingerprint Scanner"></div>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'SECURE ACCESS'}
            </button>
            {error && <div className="login-error" role="alert">{error}</div>}
          </form>
          <button className="demo-btn" type="button" onClick={() => setIsVisible(true)}>
            ◉ Use Demo Credentials
          </button>
          <div className="support-link">
            Need assistance? <a href="https://github.com/yukesshwaran21/Military_Asset_Management_System">Contact IT Support</a>
          </div>
        </section>
      </main>

      {isVisible && (
        <section className="demo-overlay" onClick={handleOverlayClick}>
          <div className="demo-overlay-content">
            <h2>Demo Credentials</h2>
            <button className="demo-close" type="button" onClick={() => setIsVisible(false)}>✕</button>
            <p>Select a role to test the system with pre-configured demo accounts.</p>
            <div className="demo-roles">
              {demoRoles.map((role) => (
                <div className="demo-role" key={role.key} onClick={() => handleDemoLogin(role.email, role.password)}>
                  <header>
                    <strong>{role.title}</strong>
                    <span>{role.badge}</span>
                  </header>
                  <p>{role.desc}</p>
                  <div className="credentials">
                    <span>👤 {role.email}</span>
                    <span>🔑 {role.password}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

