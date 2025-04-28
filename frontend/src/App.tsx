import { useState } from 'react'
import { Routes, Route, Navigate, redirect } from 'react-router';

import { Heading } from './pages/app/page';
import { LandingPage } from './pages/app/LandingPage';
import RegisterPage from './pages/app/Login';
import { Button } from './components/ui/button';
import './index.css';
import { LogIn } from 'lucide-react';
import MarketingLayout from './pages/app/layout';


function App() {
  return (
      <>


      
      <Routes>
      <Route path="/" element={<MarketingLayout><LandingPage /></MarketingLayout>  } />
      <Route path="/Login" element={<LogIn />} />
      <Route path="/signup" element={<RegisterPage />} />
      
  
      </Routes>
      </>
  );
} //

export default App; 