import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
  onNotify?: (type: 'success'|'error'|'info', message: string) => void;
};

const Login: React.FC<Props> = ({ onNotify }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await login(username, password);
    setBusy(false);
    if (res.ok) {
      onNotify?.('success', 'Login successful.');
      const redirectTo = location?.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } else {
      onNotify?.('error', res.message || 'Invalid credentials');
    }
  };

  return (
    <div className="container" style={{ padding: 24 }}>
      <h2 className="title">Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360, margin: '0 auto' }}>
        <input aria-label="username" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <input aria-label="password" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="theme-toggle" type="submit" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  );
};

export default Login;
