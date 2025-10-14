import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar" style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
      <Link to="/" className="App-link">Home</Link>
      {isAuthenticated && (
        <>
          <Link to="/upload-model" className="App-link">Upload Model</Link>
          <Link to="/configure-mapping" className="App-link">Configure Mapping</Link>
          <Link to="/provision-service" className="App-link">Provision Service</Link>
          <Link to="/status" className="App-link">Status</Link>
          <Link to="/versioning" className="App-link">Versioning</Link>
          <Link to="/audit-logs" className="App-link">Audit Logs</Link>
        </>
      )}
      <div style={{ marginLeft: 'auto' }}>
        {isAuthenticated ? (
          <button className="theme-toggle" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="App-link">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
