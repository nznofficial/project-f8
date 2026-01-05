import '../App.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

function ExerciseRow({ exercise, onDelete, onUpdate }) {

    return (
        <tr>
            <td>{exercise.name}</td>
            <td>{exercise.reps}</td>
            <td>{exercise.weight}</td>
            <td>{exercise.unit}</td>
            <td>{exercise.date?.split('T')[0]}</td>
            <td><FaEdit onClick={() => onUpdate(exercise)}/>&nbsp;
                <FaTrash onClick={()=> onDelete(exercise._id)}/>
            </td>

        </tr>
    );
}

export default ExerciseRow;