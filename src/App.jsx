import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importa tus páginas
import Landing from './components/Landing.jsx'
// 🔑 Importar el componente Sobre.jsx (Ajusta la ruta si es necesario)
import Sobre from './pages/Sobre.jsx' // Asumiendo que está en src/pages/

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* 🔑 RUTA AÑADIDA: Conecta /sobre-nosotros con el componente Sobre */}
        <Route path="/sobre-nosotros" element={<Sobre />} /> 
        
      </Routes>
    </BrowserRouter>
  )
}