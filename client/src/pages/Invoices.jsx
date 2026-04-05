import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Invoices() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState('');
  const [periodType, setPeriodType] = useState('monthly');
  const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'));
  const [data, setData] = useState(null);

  useEffect(() => { api.get('/projects').then(r => setProjects(r.data)); }, []);

  const generate = async () => {
    const res = await api.get('/invoices/generate', { params: { projectId: selected, periodType, period } });
    setData(res.data);
  };

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const download = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.setFontSize(26); doc.setFont('helvetica', 'bold');
    doc.text('TRACKIFY INVOICE', 14, 24);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.text(`Project: ${data.project.name}`, 14, 38);
    doc.text(`Client: ${data.project.client || 'N/A'}`, 14, 46);
    doc.text(`Period: ${data.period} (${data.periodType})`, 14, 54);
    doc.text(`Rate: $${data.project.hourlyRate}/hr`, 14, 62);

    autoTable(doc, {
      startY: 74,
      head: [['Date', 'Description', 'Duration', 'Amount']],
      body: data.entries.map(e => [
        e.date, e.description || '-',
        fmt(e.duration),
        `$${((e.duration / 3600) * data.project.hourlyRate).toFixed(2)}`
      ]),
      foot: [['', `Total: ${data.totalHours}h`, '', `$${data.totalAmount}`]],
      headStyles: { fillColor: [13, 15, 26] },
      footStyles: { fillColor: [200, 240, 77], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    doc.save(`invoice-${data.project.name}-${data.period}.pdf`);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 64 }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Invoices</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 36 }}>Generate invoices by day, week, or month for any project.</p>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px' }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>PROJECT</label>
              <select value={selected} onChange={e => setSelected(e.target.value)}>
                <option value="">Select project...</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>PERIOD TYPE</label>
              <select value={periodType} onChange={e => {
                setPeriodType(e.target.value);
                setPeriod(e.target.value === 'monthly' ? format(new Date(), 'yyyy-MM') :
                          e.target.value === 'daily' ? format(new Date(), 'yyyy-MM-dd') : `${format(new Date(), 'yyyy')}-W20`);
              }}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>PERIOD</label>
              <input type="text" value={period} onChange={e => setPeriod(e.target.value)}
                placeholder={periodType === 'monthly' ? 'yyyy-MM' : periodType === 'daily' ? 'yyyy-MM-dd' : 'yyyy-Www'} />
            </div>
          </div>
          <button className="btn-primary" onClick={generate} disabled={!selected}>Generate Invoice</button>
        </div>

        {data && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px', marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 800 }}>{data.project.name}</h2>
                <p style={{ color: 'var(--muted)', marginTop: 4 }}>{data.period} · {data.periodType}</p>
              </div>
              <button className="btn-primary" onClick={download}>↓ Download PDF</button>
            </div>

            <div style={{ display: 'flex', gap: 24, marginBottom: 28 }}>
              {[['HOURS', `${data.totalHours}h`, 'var(--accent)'], ['EARNINGS', `$${data.totalAmount}`, 'var(--success)'], ['ENTRIES', data.entries.length, 'var(--accent2)']].map(([label, val, color]) => (
                <div key={label} style={{ background: 'var(--surface2)', borderRadius: 12, padding: '18px 24px', flex: 1 }}>
                  <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: 6, fontFamily: 'var(--font-head)' }}>{label}</p>
                  <p style={{ color, fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.6rem' }}>{val}</p>
                </div>
              ))}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Date', 'Description', 'Duration', 'Amount'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.78rem', fontFamily: 'var(--font-head)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.entries.map(e => (
                  <tr key={e._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: '0.9rem' }}>{e.date}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.9rem' }}>{e.description || '—'}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-head)', fontWeight: 600 }}>{fmt(e.duration)}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--success)', fontWeight: 600, fontFamily: 'var(--font-head)' }}>
                      ${((e.duration / 3600) * data.project.hourlyRate).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}