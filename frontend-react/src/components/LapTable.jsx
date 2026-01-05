import LapRow from './LapRow';

function LapTable({ laps, onDelete, onUpdate}) {
    return (
        <div className="collection-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th>Unit</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {laps.map((lap) => <LapRow lap={lap} 
                    onDelete={onDelete} onUpdate={onUpdate} key={lap._id} />)}
                </tbody>
            </table>
        </div>
    );
}

export default LapTable;