import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Páginas principales
import AltaUsuario from './pages/altausuario.jsx'
import CrearLocalOGrupo from './pages/crearlocalogrupo.jsx'
import Agenda from './pages/agenda.jsx'
// import FichaEvento from './pages/ficha_evento.jsx'   ← comentada o borrada

// Página genérica para legales (sobre, legal, privacidad, cookies, términos)
import StaticPage from './pages/StaticPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas principales */}
        <Route path="/" element={<AltaUsuario />} />
        <Route path="/crear_local_o_grupo" element={<CrearLocalOGrupo />} />
        <Route path="/agenda" element={<Agenda />} />

        {/* Rutas que vienen de los .html (gracias a vercel.json) */}
        <Route path="/alta-usuario" element={<AltaUsuario />} />
        <Route path="/evento" element={<FichaEvento />} />
        <Route path="/perfil" element={<AltaUsuario />} />          {/* temporal hasta tener ficha_usuario */}
        <Route path="/registro" element={<AltaUsuario />} />       {/* temporal hasta tener registro real */}

        {/* Páginas legales y estáticas */}
        <Route path="/sobre" element={<StaticPage />} />
        <Route path="/legal" element={<StaticPage />} />
        <Route path="/privacidad" element={<StaticPage />} />
        <Route path="/cookies" element={<StaticPage />} />
        <Route path="/terminos" element={<StaticPage />} />
      </Routes>
    </BrowserRouter>
  )
}