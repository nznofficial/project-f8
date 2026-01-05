import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UpdatePage = ({lapToUpdate}) => {
    const [name, setName] = useState(lapToUpdate.name);
    const [reps, setReps] = useState(lapToUpdate.reps);
    const [weight, setWeight] = useState(lapToUpdate.weight);
    const [unit, setUnit] = useState(lapToUpdate.unit);
    const [date, setDate] = useState(lapToUpdate.date?.split('T')[0]);

    const navigate = useNavigate();

    const updateLap = async (event) => {
        event.preventDefault();

        const updatedLap = {name, reps, weight, unit, date}

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
                        Name:&nbsp;
                        <input
                            type="text"
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
                <button type="submit">Update</button>
            </form>
        </>
    );
}

export default UpdatePage;