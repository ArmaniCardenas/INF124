// src/main.tsx
import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./pages/app/LandingPage/ThemeProvider"
import App from "./App"
import "./index.css"
import 'react-toastify/dist/ReactToastify.css';
import { CookiesProvider } from 'react-cookie';

const queryClient = new QueryClient()


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CookiesProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </CookiesProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
