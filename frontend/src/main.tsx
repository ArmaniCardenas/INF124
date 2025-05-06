import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import {QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App'
import 'react-toastify/dist/ReactToastify.css';
import { CookiesProvider } from 'react-cookie';

const queryClient = new QueryClient(); 


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CookiesProvider>
      
          <App />
        </CookiesProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
