import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UpdatePage = ({exerciseToUpdate}) => {
    const [name, setName] = useState(exerciseToUpdate.name);
    const [reps, setReps] = useState(exerciseToUpdate.reps);
    const [weight, setWeight] = useState(exerciseToUpdate.weight);
    const [unit, setUnit] = useState(exerciseToUpdate.unit);
    const [date, setDate] = useState(exerciseToUpdate.date?.split('T')[0]);

    const navigate = useNavigate();

    const updateExercise = async (event) => {
        event.preventDefault();

        const updatedExercise = {name, reps, weight, unit, date}

        const response = await fetch(
            `/exercises/${exerciseToUpdate._id}`, {
                method: 'PUT',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(updatedExercise)
                }
        );
        if(response.status === 200){
            alert("Successfully updated the exercise");
        } else{
            alert("Failed to update the exercise, status code = " + response.status)
        }
        navigate('/')
    };

    return (
        <>
            <h2>Update Exercise</h2>
            <form onSubmit={updateExercise}>
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