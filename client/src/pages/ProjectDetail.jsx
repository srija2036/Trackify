import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, startOfMonth, eachDayOfInterval, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [entries, setEntries] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [desc, setDesc] = useState('');
  const [tab, setTab] = useState('week'); // 'day' | 'week' | 'month'

  useEffect(() => {
    api.get(`/projects/${id}`).then(r => setProject(r.data));
    api.get(`/time-entries?project=${id}`).then(r => setEntries(r.data));
  }, [id]);

  // Timer tick
  useEffect(() => {
    if (!activeTimer) return;
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [activeTimer]);

  const startTimer = async () => {
    const res = await api.post('/time-entries/start', { projectId: id, description: desc });
    setActiveTimer(res.data);
    setElapsed(0);
  };

  const stopTimer = async () => {
    const res = await api.put(`/time-entries/stop/${activeTimer._id}`);
    setActiveTimer(null);
    setEntries(prev => [res.data, ...prev]);
  };

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Filter entries by tab
  const today = format(new Date(), 'yyyy-MM-dd');
  const filteredEntries = entries.filter(e => {
    if (tab === 'day') return e.date === today;
    if (tab === 'week') {
      const start = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const end = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      return e.date >= start && e.date <= end;
    }
    if (tab === 'month') return e.date?.startsWith(format(new Date(), 'yyyy-MM'));
    return true;
  });

  const totalSecs = filteredEntries.reduce((s, e) => s + (e.duration || 0), 0);
  const totalHours = totalSecs / 3600;
  const totalAmount = project ? (totalHours * project.hourlyRate).toFixed(2) : '0.00';

  // Chart data for week (daily breakdown)
  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 })
  });
  const chartData = weekDays.map(d => {
    const ds = format(d, 'yyyy-MM-dd');
    const hrs = entries.filter(e => e.date === ds).reduce((s, e) => s + e.duration, 0) / 3600;
    return { day: format(d, 'EEE'), hours: +hrs.toFixed(2) };
  });

  // PDF Invoice Download
  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 14, 22);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Project: ${project?.name}`, 14, 34);
    doc.text(`Client: ${project?.client || 'N/A'}`, 14, 42);
    doc.text(`Period: ${tab.toUpperCase()} · ${today}`, 14, 50);
    doc.text(`Rate: $${project?.hourlyRate}/hr`, 14, 58);

    autoTable(doc, {
      startY: 68,
      head: [['Date', 'Description', 'Duration', 'Amount']],
      body: filteredEntries.map(e => [
        e.date,
        e.description || '-',
        fmt(e.duration),
        `$${((e.duration / 3600) * (project?.hourlyRate || 0)).toFixed(2)}`
      ]),
      foot: [['', '', 'TOTAL', `$${totalAmount}`]],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [13, 15, 26] },
      footStyles: { fillColor: [200, 240, 77], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    doc.save(`${project?.name}-${tab}-invoice.pdf`);
  };

  if (!project) return <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Loading...</div>;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 64 }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: project.color }} />
              <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 800 }}>{project.name}</h1>
            </div>
            <p style={{ color: 'var(--muted)' }}>{project.client || 'Personal'} · ${project.hourlyRate}/hr</p>
          </div>
          <button className="btn-primary" onClick={downloadInvoice}>
            ↓ Download Invoice
          </button>
        </div>

        {/* Timer */}
        <div style={{
          background: 'var(--surface)', border: `1px solid ${activeTimer ? project.color : 'var(--border)'}`,
          borderRadius: 20, padding: '28px 32px', marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap'
        }}>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: '2.5rem', fontWeight: 800,
            color: activeTimer ? project.color : 'var(--text)', letterSpacing: '0.05em', minWidth: 160
          }}>
            {fmt(elapsed)}
          </div>
          <input placeholder="What are you working on?" value={desc}
            onChange={e => setDesc(e.target.value)}
            style={{ flex: 1, minWidth: 200 }} />
          <button
            onClick={activeTimer ? stopTimer : startTimer}
            style={{
              background: activeTimer ? 'var(--danger)' : project.color,
              color: activeTimer ? 'white' : '#06070D',
              padding: '12px 28px', borderRadius: 10, fontFamily: 'var(--font-head)',
              fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.95rem'
            }}>
            {activeTimer ? '⏹ Stop' : '▶ Start'}
          </button>
        </div>

        {/* Period tabs + Stats */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {['day', 'week', 'month'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: '8px 22px', borderRadius: 8, border: '1px solid var(--border)',
                background: tab === t ? 'rgba(200,240,77,0.1)' : 'transparent',
                color: tab === t ? 'var(--accent)' : 'var(--muted)',
                fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                borderColor: tab === t ? 'var(--accent)' : 'var(--border)'
              }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: 2 }}>HOURS</p>
              <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--accent)' }}>{totalHours.toFixed(2)}h</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: 2 }}>EARNINGS</p>
              <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--success)' }}>${totalAmount}</p>
            </div>
          </div>
        </div>

        {/* Weekly chart */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '28px', marginBottom: 28
        }}>
          <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: 20 }}>This Week</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={32}>
              <XAxis dataKey="day" tick={{ fill: '#6B6E85', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6E85', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }}
                cursor={{ fill: 'rgba(200,240,77,0.05)' }}
              />
              <Bar dataKey="hours" fill={project.color} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time entries table */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden'
        }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>
              Time Entries · {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </h3>
          </div>
          {filteredEntries.length === 0 ? (
            <p style={{ color: 'var(--muted)', padding: '32px 28px', textAlign: 'center' }}>No entries for this period.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Date', 'Description', 'Duration', 'Amount'].map(h => (
                    <th key={h} style={{ padding: '12px 24px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.78rem', fontFamily: 'var(--font-head)', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(e => (
                  <tr key={e._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 24px', fontSize: '0.9rem', color: 'var(--muted)' }}>{e.date}</td>
                    <td style={{ padding: '14px 24px', fontSize: '0.9rem' }}>{e.description || '—'}</td>
                    <td style={{ padding: '14px 24px', fontFamily: 'var(--font-head)', fontWeight: 600 }}>{fmt(e.duration)}</td>
                    <td style={{ padding: '14px 24px', color: 'var(--success)', fontWeight: 600, fontFamily: 'var(--font-head)' }}>
                      ${((e.duration / 3600) * project.hourlyRate).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}