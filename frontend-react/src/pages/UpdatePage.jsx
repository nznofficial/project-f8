import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UpdatePage = ({lapToUpdate}) => {
    const [userId, setUserId] = useState(lapToUpdate.userId);
    const [date, setDate] = useState(lapToUpdate.date?.split('T')[0]);
    const [weightAmLb, setWeightAmLb] = useState(lapToUpdate.weightAmLb);
    const [steps, setSteps] = useState(lapToUpdate.steps);
    const [workout, setWorkout] = useState(lapToUpdate.workout);
    const [calories, setCalories] = useState(lapToUpdate.calories);
    const [proteinG, setProteinG] = useState(lapToUpdate.proteinG);
    const [sleepHours, setSleepHours] = useState(lapToUpdate.sleepHours);
    const [notes, setNotes] = useState(lapToUpdate.notes);

    const navigate = useNavigate();

    const updateLap = async (event) => {
        event.preventDefault();

        const updatedLap = {userId, date, weightAmLb, steps, workout, calories, proteinG, sleepHours, notes}

        const response = await fetch(
            `/laps/${lapToUpdate._id}`, {
                method: 'PUT',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(updatedLap)
                }
        );
        if(response.status === 200){
            alert("Successfully updated the lap");
        } else{
            alert("Failed to update the lap, status code = " + response.status)
        }
        navigate('/')
    };

    return (
        <>
            <h2>Update Lap</h2>
            <form onSubmit={updateLap}>
                <p>
                    <label>
                        UserId:&nbsp;
                        <select
                            value={userId}
                            onChange={e => setUserId(e.target.value)}>
                            <option value="69584ea973190aee8425e2ce">Tinkle Monkey</option>
                            <option value="69584e8173190aee8425e2cd">Pookey Bear</option>
                            <option value="69785c19e021df4df1d6fc3a">Glitch Matrix</option>
                        </select>
                    </label>
                </p>
                <p>
                    <label>
                        Date:&nbsp;
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}/>
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
                            onChange={e => setWeightAmLb(e.target.valueAsNumber)}/>
                    </label>
                </p>
                <p>
                    <label>
                        Steps:&nbsp;
                        <input
                            type="number"
                            min="0"
                            value={steps}
                            onChange={e => setSteps(e.target.valueAsNumber)}/>
                    </label>
                </p>
                <p>
                    <label>
                        Workout:&nbsp;
                        <select
                            value={workout}
                            onChange={e => setWorkout(e.target.value)}>
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
                            onChange={e => setCalories(e.target.valueAsNumber)}/>
                    </label>
                </p>
                <p>
                    <label>
                        Protein:&nbsp;
                        <input
                            type="number"
                            min="0"
                            value={proteinG}
                            onChange={e => setProteinG(e.target.valueAsNumber)}/>
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
                            onChange={e => setSleepHours(e.target.valueAsNumber)}/>
                    </label>
                </p>
                <p>
                    <label>
                        Notes:&nbsp;
                        <input
                            type="text"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}/>
                    </label>
                </p>
                <button type="submit">Update</button>
            </form>
        </>
    );
}

export default UpdatePage;