import LapTable from '../components/LapTable';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RetrievePage({ setLapToUpdate }) {
  const [laps, setLaps] = useState([]);
  const navigate = useNavigate();

  const loadLaps = async () => {
    const response = await fetch('/laps');
    const data = await response.json();
    setLaps(data);
  };

  useEffect(() => {
    loadLaps();
  }, []);

  const onDelete = async (_id) => {
    const response = await fetch(`/laps/${_id}`, { method: 'DELETE' });
    if (response.status === 204) {
      setLaps(laps.filter((e) => e._id !== _id));
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

      {/* Desktop/tablet table */}
      <div className="laps-table">
        <LapTable laps={laps} onDelete={onDelete} onUpdate={onUpdate} />
      </div>

      {/* Mobile cards */}
      <div className="laps-cards">
        {laps.map((lap) => {
          const dateStr = lap.date ? String(lap.date).split('T')[0] : '';
          return (
            <div className="lap-card" key={lap._id}>
                <div className="lap-card-top">
                <div>
                    <div className="lap-card-user">
                    {lap.userName ?? lap.userId?.name}
                    </div>
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
