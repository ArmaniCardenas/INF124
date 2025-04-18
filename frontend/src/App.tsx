import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router';

import { Heading } from './pages/app/page';
import { LandingPage } from './pages/app/LandingPage';
import RegisterPage from './pages/app/Login';
import { Button } from './components/ui/button';
import './index.css';


function App() {
  return (
      <>

  

      <Routes>
        <Route path="/Login" element={<RegisterPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
      </>
  );
}

export default App;