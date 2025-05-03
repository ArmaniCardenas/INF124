import { useState } from 'react'
import { Routes, Route, Navigate, redirect } from 'react-router';

import { Heading } from './pages/app/LandingPage/page';
import { LandingPage } from './pages/app/LandingPage/LandingPage';
import RegisterPage from './pages/auth/Login';
import { Button } from './components/ui/button';
import './index.css';
import { LogIn } from 'lucide-react';
import MarketingLayout from './pages/app/layout';
import Navigation from './pages/app/Main/Navigation';
import DocumentsPage from './pages/app/Main/DocumentsPage';
import MainLayout from './pages/app/Main/MainLayout';

function App() {
  return (
      <>

      <Routes>
      <Route path="/" element={<MarketingLayout><LandingPage /></MarketingLayout>  } />
      <Route path="/Login" element={<LogIn />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/Main" element={ <MainLayout>
        <DocumentsPage /></MainLayout>} />
  
  
      </Routes>
      </>
  );
} //

export default App; 