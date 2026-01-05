import LapTable from '../components/LapTable';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RetrievePage({setLapToUpdate}) {
    const [laps, setLaps] = useState([]);
    const navigate = useNavigate();

    const loadLaps = async () => {
        const response = await fetch('/laps')
        const data = await response.json();
        setLaps(data)
    }

    useEffect( () => {
        loadLaps();
        }, []);

    const onDelete = async (_id) => {
        const response = await fetch(
            `/laps/${_id}`,
            {method: 'DELETE'}
        );
        if (response.status === 204){
            setLaps(laps.filter(e => e._id !== _id))
        } else{
            alert(`Failed to delete lap with _id = ${_id}, status code = ${response.status}`)
        }
    }

    const onUpdate = async (lap) => {
        setLapToUpdate(lap)
        navigate('/update-lap')
    }

    return (
        <>
            <h2>List of Laps</h2>
            <LapTable laps={laps} onDelete={onDelete} onUpdate={onUpdate}></LapTable>
        </>
    );
}

export default RetrievePage;