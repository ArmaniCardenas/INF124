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
import MainLayout from './pages/app/Main/MainLayout';import Login from './pages/app/Login';
import Signup from './pages/app/SignUp';
import Home from './pages/app/Home';
import Profile from './pages/app/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
// import ProtectedRoute from './components/auth/protectedRoute';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        /> 
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />        
        <Route 
          path="/" 
          element={
            <MarketingLayout>
              <LandingPage />
            </MarketingLayout>  
          } 
        />
        <Route 
          path="/Main"
          element={ 
            <ProtectedRoute>
              <MainLayout>
                <DocumentsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
       <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
} //

export default App; 