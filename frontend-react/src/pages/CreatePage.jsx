import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreatePage = () => {

    const [name, setName] = useState('');
    const [reps, setReps] = useState(1);
    const [weight, setWeight] = useState(0);
    const [unit, setUnit] = useState('kgs');
    const [date, setDate] = useState('');

    const navigate = useNavigate();

    const addLap = async (event) => {
        event.preventDefault();
        const newLap = {name, reps, weight, unit}

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
                        Name:&nbsp;
                        <input
                            type="text"
                            placeholder="Enter name here"
                            value={name}
                            onChange={e => setName(e.target.value)}/>
                    </label>
                </p>
                <p>
                    <label>
                        Reps:&nbsp;
                        <input
                            type="number"
                            min="1"
                            value={reps}
                            placeholder="Enter reps here"
                            onChange={e => setReps(e.target.valueAsNumber)}/>
                    </label>
                </p>
                <p>
                    <label>
                        Weight:&nbsp;
                        <input
                            type="number"
                            min="0"
                            value={weight}
                            placeholder="Enter weight here"
                            onChange={e => setWeight(e.target.valueAsNumber)}/>
                    </label>
                </p>
                <p>
                    <label>
                        Unit:&nbsp;
                        <select
                            value={unit}
                            onChange={e => setUnit(e.target.value)}>
                        <option value="kgs">kgs</option>
                        <option value="lbs">lbs</option>
                        <option value="miles">miles</option>
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
                <button type="submit">Create</button>
            </form>
        </>
    );
}

export default CreatePage;