import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const COLORS = ['#C8F04D', '#4D7CF0', '#FF4D6D', '#4DFFB4', '#FFB347', '#BF5FFF'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', client: '', description: '', hourlyRate: '', color: COLORS[0] });
  const nav = useNavigate();

  const load = () => api.get('/projects').then(r => setProjects(r.data));
  useEffect(() => { load(); }, []);

  const createProject = async () => {
    await api.post('/projects', form);
    setShowModal(false);
    setForm({ name: '', client: '', description: '', hourlyRate: '', color: COLORS[0] });
    load();
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 64 }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 800 }}>Projects</h1>
            <p style={{ color: 'var(--muted)', marginTop: 4 }}>{projects.length} total projects</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ New Project</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {projects.map(p => (
            <div key={p._id} onClick={() => nav(`/projects/${p._id}`)}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 20, padding: '28px 28px', cursor: 'pointer',
                transition: 'all 0.25s', position: 'relative', overflow: 'hidden'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = p.color; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                background: p.color || 'var(--accent)'
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.2rem', fontWeight: 700 }}>{p.name}</h3>
                <span style={{
                  background: p.status === 'active' ? 'rgba(77,255,180,0.1)' : 'rgba(107,110,133,0.15)',
                  color: p.status === 'active' ? 'var(--success)' : 'var(--muted)',
                  padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600
                }}>{p.status}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: 20 }}>
                {p.client || 'Personal'} {p.description && `· ${p.description.slice(0, 50)}`}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: p.color, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.1rem' }}>
                  ${p.hourlyRate}/hr
                </span>
                <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>View details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 24, padding: '40px', width: '100%', maxWidth: 480
          }}>
            <h2 style={{ fontFamily: 'var(--font-head)', marginBottom: 28 }}>New Project</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Project Name *', key: 'name', placeholder: 'e.g. Brand Website' },
                { label: 'Client Name', key: 'client', placeholder: 'e.g. Acme Corp' },
                { label: 'Hourly Rate ($)', key: 'hourlyRate', placeholder: '50', type: 'number' },
                { label: 'Description', key: 'description', placeholder: 'Brief description...' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type || 'text'} placeholder={f.placeholder}
                    value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: 10 }}>PROJECT COLOR</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {COLORS.map(c => (
                    <div key={c} onClick={() => setForm({ ...form, color: c })}
                      style={{
                        width: 30, height: 30, borderRadius: '50%', background: c, cursor: 'pointer',
                        border: form.color === c ? `3px solid white` : '3px solid transparent',
                        transition: 'border 0.2s'
                      }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={createProject}>Create Project</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}