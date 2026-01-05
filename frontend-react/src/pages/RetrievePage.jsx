import ExerciseTable from '../components/ExerciseTable';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RetrievePage({setExerciseToUpdate}) {
    const [exercises, setExercises] = useState([]);
    const navigate = useNavigate();

    const loadExercises = async () => {
        const response = await fetch('/exercises')
        const data = await response.json();
        setExercises(data)
    }

    useEffect( () => {
        loadExercises();
        }, []);

    const onDelete = async (_id) => {
        const response = await fetch(
            `/exercises/${_id}`,
            {method: 'DELETE'}
        );
        if (response.status === 204){
            setExercises(exercises.filter(e => e._id !== _id))
        } else{
            alert(`Failed to delete exercise with _id = ${_id}, status code = ${response.status}`)
        }
    }

    const onUpdate = async (exercise) => {
        setExerciseToUpdate(exercise)
        navigate('/update-exercise')
    }

    return (
        <>
            <h2>List of Exercises</h2>
            <ExerciseTable exercises={exercises} onDelete={onDelete} onUpdate={onUpdate}></ExerciseTable>
        </>
    );
}

export default RetrievePage;