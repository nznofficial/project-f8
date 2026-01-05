import ExerciseRow from './ExerciseRow';

function ExerciseTable({ exercises, onDelete, onUpdate}) {
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
                    {exercises.map((exercise) => <ExerciseRow exercise={exercise} 
                    onDelete={onDelete} onUpdate={onUpdate} key={exercise._id} />)}
                </tbody>
            </table>
        </div>
    );
}

export default ExerciseTable;