import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { format, subDays } from 'date-fns';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data));
    api.get('/time-entries').then(r => setEntries(r.data));
  }, []);

  const totalSeconds = entries.reduce((s, e) => s + (e.duration || 0), 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);

  // Build last 7 days chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const label = format(subDays(new Date(), 6 - i), 'EEE');
    const hrs = entries
      .filter(e => e.date === d)
      .reduce((s, e) => s + e.duration, 0) / 3600;
    return { day: label, hours: +hrs.toFixed(2) };
  });

  const statCard = (title, value, sub) => (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '28px 32px', flex: 1
    }}>
      <p style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'var(--font-head)', letterSpacing: '0.08em', marginBottom: 10 }}>{title}</p>
      <p style={{ fontSize: '2.4rem', fontFamily: 'var(--font-head)', fontWeight: 800, color: 'var(--accent)' }}>{value}</p>
      {sub && <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 64 }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Dashboard</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 36 }}>{format(new Date(), 'EEEE, MMMM d yyyy')}</p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          {statCard('TOTAL HOURS', `${totalHours}h`, 'All time')}
          {statCard('ACTIVE PROJECTS', projects.filter(p => p.status === 'active').length, 'Currently running')}
          {statCard('THIS WEEK', chartData.reduce((s, d) => s + d.hours, 0).toFixed(1) + 'h', 'Last 7 days')}
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '28px 32px'
        }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 24 }}>Hours — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={28}>
              <XAxis dataKey="day" tick={{ fill: '#6B6E85', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6E85', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }}
                cursor={{ fill: 'rgba(200,240,77,0.05)' }}
              />
              <Bar dataKey="hours" fill="#C8F04D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Projects */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 20 }}>Recent Projects</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {projects.slice(0, 4).map(p => (
              <div key={p._id} onClick={() => nav(`/projects/${p._id}`)}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '22px 24px', cursor: 'pointer',
                  borderLeft: `4px solid ${p.color || 'var(--accent)'}`,
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h4 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 6 }}>{p.name}</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{p.client || 'No client'}</p>
                <p style={{ color: 'var(--accent)', fontSize: '0.85rem', marginTop: 12, fontWeight: 600 }}>
                  ${p.hourlyRate}/hr
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}