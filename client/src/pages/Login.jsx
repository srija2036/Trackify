import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 440
      }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', marginBottom: 8 }}>Welcome back</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Log in to your Trackify workspace</p>

        {error && <p style={{ color: 'var(--danger)', marginBottom: 16, fontSize: '0.9rem' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>EMAIL</label>
            <input type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>PASSWORD</label>
            <input type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <Link to="/forgot" style={{ color: 'var(--accent)', fontSize: '0.9rem', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>
          <button className="btn-primary" style={{ marginTop: 8, width: '100%', padding: '14px' }}
            onClick={handleSubmit}>
            Login →
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--muted)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}