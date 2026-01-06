import LapRow from './LapRow';

function LapTable({ laps, onDelete, onUpdate }) {
  return (
    <>
      {/* ---------- Desktop Table ---------- */}
      <div className="table-wrap laps-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Weight</th>
              <th>Steps</th>
              <th>Workout</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Sleep</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {laps.map((lap) => (
              <LapRow
                key={lap._id}
                lap={lap}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Mobile Cards ---------- */}
      <div className="laps-cards">
        {laps.map((lap) => (
          <div className="lap-card" key={lap._id}>
            <div className="lap-card-top">
              <div>
                <div className="lap-card-user">
                  {lap.userId?.name}
                </div>
                <div className="lap-card-date">
                  {lap.date?.split('T')[0]}
                </div>
              </div>

              <div className="lap-card-workout">
                {lap.workout}
              </div>
            </div>

            <div className="lap-grid">
              <div className="lap-metric">
                <div className="k">Weight</div>
                <div className="v">
                  {lap.weightAmLb}
                  <span className="unit">lb</span>
                </div>
              </div>

              <div className="lap-metric">
                <div className="k">Steps</div>
                <div className="v">{lap.steps}</div>
              </div>

              <div className="lap-metric">
                <div className="k">Calories</div>
                <div className="v">{lap.calories}</div>
              </div>

              <div className="lap-metric">
                <div className="k">Protein</div>
                <div className="v">
                  {lap.proteinG}
                  <span className="unit">g</span>
                </div>
              </div>

              <div className="lap-metric">
                <div className="k">Sleep</div>
                <div className="v">
                  {lap.sleepHours}
                  <span className="unit">hrs</span>
                </div>
              </div>
            </div>

            {lap.notes && (
              <div className="notes" style={{ marginTop: '8px' }}>
                {lap.notes}
              </div>
            )}

            <div className="lap-card-actions">
              <button onClick={() => onUpdate(lap)}>Edit</button>
              <button onClick={() => onDelete(lap._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default LapTable;
