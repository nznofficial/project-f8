import LapTable from '../components/LapTable';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RetrievePage({ setLapToUpdate }) {
  const [laps, setLaps] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(''); // '' = All users
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const lapsUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedUserId) params.set('userId', selectedUserId);
    const qs = params.toString();
    return qs ? `/laps?${qs}` : '/laps';
  }, [selectedUserId]);

  const loadUsers = async () => {
    const res = await fetch('/users?active=true');
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  const loadLaps = async () => {
    setLoading(true);
    try {
      const res = await fetch(lapsUrl);
      const data = await res.json();
      setLaps(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    loadUsers();
  }, []);

  useEffect(() => {
    // reload when filter changes
    loadLaps();
  }, [lapsUrl]);

  const onDelete = async (_id) => {
    const response = await fetch(`/laps/${_id}`, { method: 'DELETE' });
    if (response.status === 204) {
      // remove locally
      setLaps((prev) => prev.filter((e) => e._id !== _id));
    } else {
      alert(`Failed to delete lap with _id = ${_id}, status code = ${response.status}`);
    }
  };

  const onUpdate = async (lap) => {
    setLapToUpdate(lap);
    navigate('/update-lap');
  };

  return (
    <>
      <h2>List of Laps</h2>

      {/* --- Filter Bar --- */}
      <div style={{ display: 'grid', gap: 10, margin: '10px 0 18px' }}>
        <label htmlFor="userFilter">Filter by user</label>

        <select
          id="userFilter"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">All users</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        {loading ? <p style={{ marginTop: 6 }}>Loading laps…</p> : null}
      </div>

      {/* Desktop/tablet table */}
      <div className="laps-table">
        <LapTable laps={laps} onDelete={onDelete} onUpdate={onUpdate} />
      </div>

      {/* Mobile cards (kept here if you're still using this layout on the page) */}
      <div className="laps-cards">
        {laps.map((lap) => {
          const dateStr = lap.date ? String(lap.date).split('T')[0] : '';
          const userName = lap.userId?.name ?? '(unknown user)';

          return (
            <div className="lap-card" key={lap._id}>
              <div className="lap-card-top">
                <div>
                  <div className="lap-card-user">{userName}</div>
                  <div className="lap-card-date">{dateStr}</div>
                </div>

                <div className="lap-card-workout">{lap.workout}</div>
              </div>

              <div className="lap-grid">
                <div className="lap-metric">
                  <div className="k">Weight</div>
                  <div className="v">
                    {Number.isFinite(lap.weightAmLb) ? lap.weightAmLb : '-'}
                    <span className="unit">lb</span>
                  </div>
                </div>

                <div className="lap-metric">
                  <div className="k">Steps</div>
                  <div className="v">{lap.steps ?? 0}</div>
                </div>

                <div className="lap-metric">
                  <div className="k">Calories</div>
                  <div className="v">{lap.calories ?? 0}</div>
                </div>

                <div className="lap-metric">
                  <div className="k">Protein</div>
                  <div className="v">
                    {lap.proteinG ?? 0}
                    <span className="unit">g</span>
                  </div>
                </div>

                <div className="lap-metric">
                  <div className="k">Sleep</div>
                  <div className="v">
                    {Number.isFinite(lap.sleepHours) ? lap.sleepHours : 0}
                    <span className="unit">hrs</span>
                  </div>
                </div>
              </div>

              {lap.notes ? <p className="notes" style={{ marginTop: 10 }}>{lap.notes}</p> : null}

              <div className="lap-card-actions">
                <button onClick={() => onUpdate(lap)}>Edit</button>
                <button className="primary" onClick={() => onDelete(lap._id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default RetrievePage;
