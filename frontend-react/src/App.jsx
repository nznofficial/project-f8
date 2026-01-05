//vazqueem - Emmanuel Vazquez

import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RetrievePage from './pages/RetrievePage';
import CreatePage from './pages/CreatePage';
import UpdatePage from './pages/UpdatePage';
import { useState } from 'react';

function App() {

  const [exerciseToUpdate, setExerciseToUpdate] = useState(null);

  return (
    <>
      <header>
        <h1>Beaver Exercise Tracker</h1>
        <p>Track your exercises</p>
      </header>
      <Router>
        <nav>
          <Link to="/">View Exercises</Link>
          <Link to="/create-exercise">Create Exercise</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<RetrievePage setExerciseToUpdate={setExerciseToUpdate}/>}></Route>
            <Route path="/create-exercise" element={ <CreatePage />}></Route>
            <Route path="/update-exercise" element={ <UpdatePage exerciseToUpdate={exerciseToUpdate} />}></Route>
          </Routes>
        </main>
      </Router>
      <footer>
          <p>&copy; 2025 Emmanuel Vazquez</p>
      </footer>
    </>
  );
}

export default App; 