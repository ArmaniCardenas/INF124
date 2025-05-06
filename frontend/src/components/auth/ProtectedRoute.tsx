import React, { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

interface ProtectedRouteProps {
  children: ReactNode;
}

interface VerifyTokenResponse {
  success: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data }: AxiosResponse<VerifyTokenResponse> = await axios.post(
          "http://localhost:4000/verify-token",
          {},
          { withCredentials: true }
        );
        setIsAuthenticated(data.success);

      } catch (error) {
        console.error("Error verifying token:", error);
        setIsAuthenticated(false);
      }
    };
  
    verifyToken();
  }, []); 


  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;