import { Routes, Route, Navigate, redirect, BrowserRouter } from 'react-router';

import { Heading } from './pages/app/LandingPage/page';
import { LandingPage } from './pages/app/LandingPage/LandingPage';
import RegisterPage from './pages/auth/Login';
import { Button } from './components/ui/button';
import './index.css';
import MarketingLayout from './pages/app/layout';
import Navigation from './pages/app/Main/LeftSideBar/Navigation';
import DocumentsPage from './pages/app/Main/DocumentsPage';
import MainLayout from './pages/app/Main/MainLayout';
import Login from './pages/app/Login';
import Signup from './pages/app/SignUp';
import Home from './pages/app/Home';
import Profile from './pages/app/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
//import { MyDocumentsPage } from './pages/app/Document/MyDocumentsPage';
//import { DocumentEditorPage } from './pages/app/Document/DocumentEditorPage';
import DocumentPage from './pages/app/Document/DocumentPage';
import { ToastContainer } from 'react-toastify';


export default function App() {
  return (
    <>
    <BrowserRouter>
      
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


        <Route 
          path="/" 
          element={
            <MarketingLayout>
              <LandingPage />
            </MarketingLayout>  
          } />

        

    
        
          
       


        <Route
          path="/documents/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DocumentsPage />} />

          <Route path=":slugAndId" element={<DocumentPage />} />
        </Route>

 
        
       <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
    </>
  );
} //

