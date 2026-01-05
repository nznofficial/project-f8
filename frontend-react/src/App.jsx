//vazqueem - Emmanuel Vazquez

import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RetrievePage from './pages/RetrievePage';
import CreatePage from './pages/CreatePage';
import UpdatePage from './pages/UpdatePage';
import { useState } from 'react';

function App() {

  const [lapToUpdate, setLapToUpdate] = useState(null);

  return (
    <>
      <header>
        <h1>Project F8 Tracker</h1>
        <p>Track your laps</p>
      </header>
      <Router>
        <nav>
          <Link to="/">View Laps</Link>
          <Link to="/create-lap">Create Lap</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<RetrievePage setLapToUpdate={setLapToUpdate}/>}></Route>
            <Route path="/create-lap" element={ <CreatePage />}></Route>
            <Route path="/update-lap" element={ <UpdatePage lapToUpdate={lapToUpdate} />}></Route>
          </Routes>
        </main>
      </Router>
      <footer>
          <p>&copy; 2026 Chomp Entertainment</p>
      </footer>
    </>
  );
}

export default App; 