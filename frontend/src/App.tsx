import { Routes, Route, Navigate } from 'react-router';

import { Heading } from './pages/app/page';
import { LandingPage } from './pages/app/LandingPage';
import './index.css';
import Login from './pages/app/Login';
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

        <Route path="/" element={<LandingPage />} />
      </Routes>
      </>
  );
}

export default App;