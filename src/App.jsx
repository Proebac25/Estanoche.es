import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importa aquí tus páginas reales cuando las migremos
// Por ahora solo mostramos la landing perfecta
import Landing from './components/Landing.jsx'   // ← lo crearemos en 2 minutos

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Aquí irán el resto de rutas cuando las migremos */}
      </Routes>
    </BrowserRouter>
  )
}