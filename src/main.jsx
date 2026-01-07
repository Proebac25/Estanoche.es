// src/main.jsx - ACTUALIZAR
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // <-- AÑADIR

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider> {/* <-- AÑADIR ESTA LÍNEA */}
          <App />
        </AuthProvider> {/* <-- AÑADIR ESTA LÍNEA */}
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)