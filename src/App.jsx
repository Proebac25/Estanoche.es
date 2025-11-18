import { BrowserRouter, Routes, Route } from 'react-router-dom'
import altausuario from './pages/altausuario.jsx' 
import crearlocalogrupo from './pages/crearlocalogrupo.jsx'
import agenda from './pages/agenda.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<altausuario />} />
        <Route path="/crear_local_o_grupo" element={<crearlocalogrupo />} />
        <Route path="/agenda" element={<agenda />} />
	<Route path="/sobre" element={<Sobre />} />
      </Routes>
    </BrowserRouter>
  )
}