//vazqueem - Emmanuel Vazquez

import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RetrievePage from './pages/RetrievePage';
import CreatePage from './pages/CreatePage';
import UpdatePage from './pages/UpdatePage';
import { useState } from 'react';
import Header from './components/Header';

function App() {

  const [lapToUpdate, setLapToUpdate] = useState(null);

  return (
    <Router>
      <Header />
        <main>
          <Routes>
            <Route path="/" element={<RetrievePage setLapToUpdate={setLapToUpdate}/>}></Route>
            <Route path="/create-lap" element={ <CreatePage />}></Route>
            <Route path="/update-lap" element={ <UpdatePage lapToUpdate={lapToUpdate} />}></Route>
          </Routes>

        </main>
      <footer>
          <p>&copy; 2026 Chomp Entertainment</p>
      </footer>
    </Router>
  );
}

export default App; 