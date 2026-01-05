import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreatePage = () => {

    const [userId, setUserId] = useState('');
    const [date, setDate] = useState('');
    const [weightAmLb, setWeightAmLb] = useState('');
    const [steps, setSteps] = useState(0);
    const [workout, setWorkout] = useState('walk');
    const [calories, setCalories] = useState(0);
    const [proteinG, setProteinG] = useState(0);
    const [sleepHours, setSleepHours] = useState(0);
    const [notes, setNotes] = useState('');

    const navigate = useNavigate();

    const addLap = async (event) => {
        event.preventDefault();
        const newLap = {userId, weightAmLb, steps, workout, calories, proteinG, sleepHours, notes}

        if (date){
            newLap.date = date;
        }

        const response = await fetch(
            '/laps', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(newLap)
                }
        );
        if(response.status === 201){
            alert("Successfully added the lap");
        } else{
            alert("Failed to add lap, status code = " + response.status)
        }
        navigate('/')
    };

    return (
        <>
            <h2>Create Lap</h2>
            <form onSubmit={addLap}>
                <p>
                    <label>
                        UserId:&nbsp;
                        <select
                            value={userId}
                            onChange={e => setUserId(e.target.value)}>
                        <option value="69584ea973190aee8425e2ce">Tinkle Monkey</option>
                        <option value="69584e8173190aee8425e2cd">Pookey Bear</option>
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
                            value={weightAmLb}
                            placeholder="Enter weight here"
                            onChange={e => setWeightAmLb(e.target.value)}/>
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
                            placeholder="Enter calories here"
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
                            placeholder="Enter protein(g) here"
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
                            value={calories}
                            placeholder="Enter sleep hours here"
                            onChange={e => setSleepHours(e.target.valueAsNumber)}/>
                    </label>
                </p>
                <p>
                    <label>
                        Notes:&nbsp;
                        <input
                            type="text"
                            value={notes}
                            placeholder="Enter notes here"
                            onChange={e => setNotes(e.target.valueAsNumber)}/>
                    </label>
                </p>
                <button type="submit">Create</button>
            </form>
        </>
    );
}

export default CreatePage;