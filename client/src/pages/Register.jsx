import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async () => {
    if (form.password !== form.confirm) return setError('Passwords do not match');
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 460
      }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', marginBottom: 8 }}>Create Account</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Start tracking. Start earning.</p>

        {error && <p style={{ color: 'var(--danger)', marginBottom: 16 }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'USERNAME', key: 'username', type: 'text', placeholder: 'johndoe' },
            { label: 'EMAIL', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'PASSWORD', key: 'password', type: 'password', placeholder: '••••••••' },
            { label: 'CONFIRM PASSWORD', key: 'confirm', type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder}
                value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          <button className="btn-primary" style={{ marginTop: 8, width: '100%', padding: '14px' }}
            onClick={handleSubmit}>
            Create Account →
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}