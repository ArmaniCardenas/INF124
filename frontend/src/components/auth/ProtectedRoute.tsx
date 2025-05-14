import React, { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({
  children
}: {
  children: React.JSX.Element;
}) {
  const {user, loading} = useAuth();
  if (loading) return <>Loading...</>
  if (!user) return <Navigate to="/login" replace />;
  return children;
}