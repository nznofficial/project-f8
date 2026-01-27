import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/project-f8-logo.png';

export const CreatePage = () => {
  const [userId, setUserId] = useState('69584ea973190aee8425e2ce');
  const [date, setDate] = useState('');
  const [weightAmLb, setWeightAmLb] = useState('');
  const [steps, setSteps] = useState(0);
  const [workout, setWorkout] = useState('walk');
  const [calories, setCalories] = useState('');
  const [proteinG, setProteinG] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [notes, setNotes] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const addLap = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    // Keep your payload logic
    const newLap = { userId, weightAmLb, steps, workout, calories, proteinG, sleepHours, notes };
    if (date) newLap.date = date;

    try {
      const response = await fetch('/laps', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(newLap),
      });

      if (response.status === 201) {
        // ✅ Success animation instead of alert
        setShowSuccess(true);

        // Optional: reset fields so if user comes back, it's clean
        // setDate('');
        // setWeightAmLb('');
        // setSteps(0);
        // setWorkout('walk');
        // setCalories('');
        // setProteinG('');
        // setSleepHours('');
        // setNotes('');

        window.setTimeout(() => {
          setShowSuccess(false);
          navigate('/');
        }, 1600);

        return; // important: don't navigate immediately
      }

      // Error path (keep alert for now)
      const txt = await response.text().catch(() => '');
      alert(`Failed to add lap, status code = ${response.status}${txt ? `\n${txt}` : ''}`);
    } catch (err) {
      alert(`Failed to add lap: ${err?.message ?? err}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h2>Create Lap</h2>

      <form onSubmit={addLap}>
        <p>
          <label>
            UserId:&nbsp;
            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
              <option value="69584ea973190aee8425e2ce">Tinkle Monkey</option>
              <option value="69584e8173190aee8425e2cd">Pookey Bear</option>
              <option value="69785c19e021df4df1d6fc3a">Glitch Matrix</option>
            </select>
          </label>
        </p>

        <p>
          <label>
            Date:&nbsp;
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </p>

        <p>
          <label>
            Weight:&nbsp;
            <input
              type="number"
              min="50"
              max="500"
              step="0.1"
              value={weightAmLb}
              placeholder="Enter weight here"
              onChange={(e) => setWeightAmLb(e.target.valueAsNumber)}
            />
          </label>
        </p>

        <p>
          <label>
            Steps:&nbsp;
            <input
              type="number"
              min="0"
              value={steps}
              placeholder="Enter steps here"
              onChange={(e) => setSteps(e.target.valueAsNumber)}
            />
          </label>
        </p>

        <p>
          <label>
            Workout:&nbsp;
            <select value={workout} onChange={(e) => setWorkout(e.target.value)}>
              <option value="lift">lift</option>
              <option value="walk">walk</option>
              <option value="both">both</option>
              <option value="rest">rest</option>
            </select>
          </label>
        </p>

        <p>
          <label>
            Calories:&nbsp;
            <input
              type="number"
              min="0"
              value={calories}
              placeholder="Enter calories here"
              onChange={(e) => setCalories(e.target.valueAsNumber)}
            />
          </label>
        </p>

        <p>
          <label>
            Protein:&nbsp;
            <input
              type="number"
              min="0"
              value={proteinG}
              placeholder="Enter protein(g) here"
              onChange={(e) => setProteinG(e.target.valueAsNumber)}
            />
          </label>
        </p>

        <p>
          <label>
            Sleep Hours:&nbsp;
            <input
              type="number"
              min="0"
              max="24"
              value={sleepHours}
              placeholder="Enter sleep hours here"
              onChange={(e) => setSleepHours(e.target.valueAsNumber)}
            />
          </label>
        </p>

        <p>
          <label>
            Notes:&nbsp;
            <input
              type="text"
              value={notes}
              placeholder="Enter notes here"
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </p>

        <button className="primary" type="submit" disabled={submitting || showSuccess}>
          {submitting ? 'Saving…' : 'Create'}
        </button>
      </form>

      {/* ✅ Success overlay */}
      {showSuccess && (
        <div className="f8-success" role="dialog" aria-modal="true" aria-label="Lap created">
          <div className="f8-success__scrim" />
          <div className="f8-success__content">
            <img className="f8-success__logo" src={logo} alt="Project F8" />
            <div className="f8-success__title">Lap Logged</div>
            <div className="f8-success__sub">Telemetry saved • returning to laps…</div>
            <div className="f8-success__flag" aria-hidden="true" />
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePage;
