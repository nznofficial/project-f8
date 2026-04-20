import { useState, useEffect } from 'react';

export default function WeeklyPage() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [pitStops, setPitStops] = useState([]);
  const [preview, setPreview] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/users?active=true')
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (users.length > 0) setUserId(users[0]._id);
  }, [users]);

  useEffect(() => {
    if (!userId) return;
    setPreview(null);
    setError('');
    fetch(`/pit-stops?userId=${userId}`)
      .then(r => r.json())
      .then(data => setPitStops(Array.isArray(data) ? data : []));
  }, [userId]);

  const handlePreview = async () => {
    setPreviewing(true);
    setError('');
    try {
      const res = await fetch('/pit-stops/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Preview failed.'); return; }
      setPreview(data);
    } finally {
      setPreviewing(false);
    }
  };

  const handleFinalize = async () => {
    if (!preview) return;
    setFinalizing(true);
    setError('');
    const weekStartLocal = new Date(preview.weekStart).toISOString().split('T')[0];
    try {
      const res = await fetch('/pit-stops/finalize', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, weekStartLocal }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Finalize failed.'); return; }
      setPreview(null);
      fetch(`/pit-stops?userId=${userId}`)
        .then(r => r.json())
        .then(d => setPitStops(Array.isArray(d) ? d : []));
    } finally {
      setFinalizing(false);
    }
  };

  const formatWeek = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  const formatChange = (val) => {
    if (val === 0) return { label: '—', cls: '' };
    return val < 0
      ? { label: `${val.toFixed(1)} lb`, cls: 'pitstop-change--loss' }
      : { label: `+${val.toFixed(1)} lb`, cls: 'pitstop-change--gain' };
  };

  return (
    <>
      <h2>Weekly</h2>

      <p>
        <label>
          Driver:&nbsp;
          <select value={userId} onChange={e => { setUserId(e.target.value); }}>
            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
        </label>
      </p>

      {/* This Week */}
      <section className="pitstop-section">
        <h3>This Week</h3>
        {preview ? (
          <div className="pitstop-preview">
            <p>Avg weight: <strong>{preview.avgWeightLb} lb</strong></p>
            <button className="primary" onClick={handleFinalize} disabled={finalizing}>
              {finalizing ? 'Finalizing…' : 'Finalize Week'}
            </button>
            <button onClick={() => setPreview(null)} style={{ marginLeft: '0.5rem' }}>Cancel</button>
          </div>
        ) : (
          <button onClick={handlePreview} disabled={previewing}>
            {previewing ? 'Loading…' : 'Preview Week'}
          </button>
        )}
        {error && <p className="pitstop-error">{error}</p>}
      </section>

      {/* History */}
      <section className="pitstop-section">
        <h3>Pit Stop History</h3>
        {pitStops.length === 0 ? (
          <p className="pitstop-empty">No pit stops recorded yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Week of</th>
                  <th>Avg Weight</th>
                  <th>Change</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[...pitStops].reverse().map(ps => {
                  const { label, cls } = formatChange(ps.weightChangeLb);
                  return (
                    <tr key={ps._id}>
                      <td>{formatWeek(ps.weekStart)}</td>
                      <td>{ps.avgWeightLb} lb</td>
                      <td className={cls}>{label}</td>
                      <td>
                        <span className={`pitstop-badge ${ps.isFinal ? 'pitstop-badge--final' : 'pitstop-badge--preview'}`}>
                          {ps.isFinal ? 'Final' : 'Preview'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
