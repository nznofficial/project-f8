import '../App.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

function LapRow({ lap, onDelete, onUpdate }) {

    return (
        <tr>
            <td>{lap.name}</td>
            <td>{lap.reps}</td>
            <td>{lap.weight}</td>
            <td>{lap.unit}</td>
            <td>{lap.date?.split('T')[0]}</td>
            <td><FaEdit onClick={() => onUpdate(lap)}/>&nbsp;
                <FaTrash onClick={()=> onDelete(lap._id)}/>
            </td>

        </tr>
    );
}

export default LapRow;