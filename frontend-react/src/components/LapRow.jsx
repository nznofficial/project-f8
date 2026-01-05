import '../App.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

function LapRow({ lap, onDelete, onUpdate }) {

    return (
        <tr>
            <td>{lap.userId}</td>
            <td>{lap.date?.split('T')[0]}</td>
            <td>{lap.weightAmLb}</td>
            <td>{lap.steps}</td>
            <td>{lap.workout}</td>
            <td>{lap.calories}</td>
            <td>{lap.proteinG}</td>
            <td>{lap.sleepHours}</td>
            <td>{lap.notes}</td>
            <td><FaEdit onClick={() => onUpdate(lap)}/>&nbsp;
                <FaTrash onClick={()=> onDelete(lap._id)}/>
            </td>

        </tr>
    );
}

export default LapRow;