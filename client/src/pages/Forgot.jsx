import { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setMessage(''); setError('');
    try {
      // Try calling backend endpoint if implemented
      await api.post('/auth/forgot', { email });
      setMessage('If that email exists we sent reset instructions.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset email');
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 64 }}>
      <Navbar />
      <div style={{ maxWidth: 520, margin: '40px auto', padding: 28, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', marginBottom: 8 }}>Forgot Password</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 18 }}>Enter your account email and we'll send password reset instructions.</p>

        {message && <p style={{ color: 'var(--success)', marginBottom: 12 }}>{message}</p>}
        {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12 }}>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          <button className="btn-primary" onClick={handleSubmit}>Send</button>
        </div>
      </div>
    </div>
  );
}
