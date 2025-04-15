import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import TestPage from './app/page';
import { Button } from './components/ui/button';

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/about" element={<TestPage />} />
      </Routes>
    </div>
  );
}

export default App;