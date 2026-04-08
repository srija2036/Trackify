import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTimer } from '../context/TimerContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/invoices', label: 'Invoices' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { activeTimer, elapsed } = useTimer();
  const nav = useNavigate();
  const { pathname } = useLocation();

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(6,7,13,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: 64
    }}>
      <Link to="/dashboard" style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)', textDecoration: 'none' }}>
        Trackify
      </Link>

      <div style={{ display: 'flex', gap: 4 }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            textDecoration: 'none', padding: '6px 18px', borderRadius: 8,
            fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '0.9rem',
            color: pathname === l.to ? 'var(--accent)' : 'var(--muted)',
            background: pathname === l.to ? 'rgba(200,240,77,0.08)' : 'transparent',
            transition: 'all 0.2s'
          }}>
            {l.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {activeTimer && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(200,240,77,0.1)', padding: '6px 14px', borderRadius: 8,
            border: '1px solid rgba(200,240,77,0.3)', minWidth: 'fit-content'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-head)', fontWeight: 700, letterSpacing: '0.08em' }}>🔴 ACTIVE</span>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--accent)' }}>{fmt(elapsed)}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeTimer.description}
            </span>
          </div>
        )}
        <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          Hey, <strong style={{ color: 'var(--text)' }}>{user?.username}</strong>
        </span>
        <button className="btn-ghost" style={{ padding: '7px 16px', fontSize: '0.85rem' }}
          onClick={() => { logout(); nav('/'); }}>
          Logout
        </button>
      </div>
    </nav>
  );
}