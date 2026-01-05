import LapRow from './LapRow';

function LapTable({ laps, onDelete, onUpdate}) {
    return (
        <div className="collection-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Weight</th>
                        <th>Steps</th>
                        <th>Workout</th>
                        <th>Calories</th>
                        <th>Protein</th>
                        <th>Sleep</th>
                        <th>Notes</th>
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