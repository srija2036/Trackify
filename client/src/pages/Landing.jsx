import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/globals.css';

export default function Landing() {
  const nav = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border)', backdropFilter: 'blur(10px)', zIndex: 20,
        background: 'linear-gradient(180deg, rgba(6,7,13,0.75), rgba(6,7,13,0.35))'
      }}>
        <motion.span whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 300 }} style={{ fontFamily: 'var(--font-head)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent)', display: 'inline-block' }}>Trackify</motion.span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-ghost" onClick={() => nav('/login')}>Login</button>
          <button className="btn-primary" onClick={() => nav('/register')}>Get Started</button>
        </div>
      </nav>

      {/* Background glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,240,77,0.10) 0%, transparent 60%)', top: -140, left: -120 }} />
        <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(77,124,240,0.08) 0%, transparent 60%)', bottom: -120, right: -100 }} />
      </div>

      {/* Hero */}
      <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px', gap: 40 }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: 'inline-block', background: 'rgba(200,240,77,0.08)', border: '1px solid rgba(200,240,77,0.2)', borderRadius: 999, padding: '6px 16px', color: 'var(--accent)', fontFamily: 'var(--font-head)', fontSize: '0.8rem', marginBottom: 20 }}>FOR FREELANCERS · BUILT FOR SPEED</div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6, ease: 'easeOut' }} style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.02, marginBottom: 18 }}>
            Track time effortlessly — get paid faster.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.6, ease: 'easeOut' }} style={{ color: 'var(--muted)', fontSize: '1.05rem', marginBottom: 26 }}>
            Powerful time tracking, project management, and invoice generation in a single dark workspace designed for freelancers and small teams.
          </motion.p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ padding: '12px 28px' }} onClick={() => nav('/register')}>Start for Free</button>
            <button className="btn-ghost" onClick={() => nav('/login')}>Demo account</button>
          </div>
        </div>

        {/* Mockup */}
        <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.25 }} style={{ width: 420, minHeight: 280, borderRadius: 18, background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))', border: '1px solid var(--border)', padding: 18, position: 'relative', boxShadow: '0 12px 40px rgba(2,6,23,0.6)', cursor: 'pointer' }}>
          <div style={{ height: 12, width: '100%', display: 'flex', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 12, height: 12, background: '#FF5F57', borderRadius: 6 }} />
            <span style={{ width: 12, height: 12, background: '#FFBD2E', borderRadius: 6 }} />
            <span style={{ width: 12, height: 12, background: '#28C840', borderRadius: 6 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.18 }} style={{ background: 'var(--surface2)', borderRadius: 12, padding: 12 }}>
              <div style={{ height: 12, width: '60%', background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 10 }} />
              <div style={{ height: 10, width: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: 6, marginBottom: 14 }} />
              <div style={{ height: 90, background: 'linear-gradient(90deg, rgba(200,240,77,0.06), rgba(77,124,240,0.04))', borderRadius: 10 }} />
            </motion.div>
            <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.18 }} style={{ background: 'var(--surface2)', borderRadius: 12, padding: 12 }}>
              <div style={{ height: 12, width: '70%', background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 10 }} />
              <div style={{ height: 130, background: 'rgba(255,255,255,0.02)', borderRadius: 10 }} />
            </motion.div>
            <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.18 }} style={{ gridColumn: '1 / -1', background: 'var(--surface)', borderRadius: 12, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Today</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.2rem' }}>3.6h</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Earnings</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, color: 'var(--success)' }}>$288</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '18px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 260 }} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, cursor: 'pointer' }}>
            <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: 8 }}>Track Time</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Start/stop timers, add manual entries, and categorize work with ease.</p>
          </motion.div>
          <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 260 }} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, cursor: 'pointer' }}>
            <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: 8 }}>Manage Projects</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Organize clients, set hourly rates, and keep all related time entries in one place.</p>
          </motion.div>
          <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 260 }} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, cursor: 'pointer' }}>
            <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: 8 }}>Invoices</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Generate PDF invoices quickly and export them for easy billing.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}