import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- 1. Importar el componente de la página principal (components/Landing.jsx) ---
import Landing from './components/Landing.jsx';

// --- 2. Importar componentes de la RAÍZ de src/pages/ ---
import Sobre from './pages/Sobre.jsx'; 
// StaticPage.jsx no es una ruta principal, lo ignoramos en el router.

// --- 3. Importar componentes de la subcarpeta AGENDA/ ---
import Agenda from './pages/agenda/Agenda.jsx'; 

// --- 4. Importar componentes de la subcarpeta LEGAL/ ---
// NOTA: Las rutas son relativas a App.jsx (../pages/subcarpeta/archivo.jsx)
import AvisoLegal from './pages/legal/AvisoLegal.jsx';
import PoliticaPrivacidad from './pages/legal/PoliticaPrivacidad.jsx';
import PoliticaCookies from './pages/legal/PoliticaCookies.jsx';
import TerminosUso from './pages/legal/TerminosUso.jsx';

// --- 5. Importar componentes de la subcarpeta REGISTRO/ ---
import AltaUsuario from './pages/registro/AltaUsuario.jsx';
import IniciarSesion from './pages/registro/Registro.jsx'; // Asumo que Registro.jsx es el que maneja IniciarSesion
// También puedes usar un componente específico si lo tienes:
// import IniciarSesion from './pages/registro/IniciarSesion.jsx'; // Si lo creaste

// Asumo que IniciarSesion es la ruta principal de login
// Y que AltaUsuario es la ruta principal de registro
// Si no tienes IniciarSesion.jsx, usaremos Registro.jsx para la ruta /iniciar-sesion.
// Dado el tree, usaremos AltaUsuario.jsx para la ruta de alta.
// Para /iniciar-sesion, asumiré que tienes IniciarSesion.jsx o lo crearemos como placeholder.
// Como el tree no lo muestra, usaré AltaUsuario como placeholder momentáneamente:
// const IniciarSesion = AltaUsuario; // Usar el mismo componente por ahora


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- A. Rutas de la Landing y Funcionalidad Principal --- */}
        <Route path="/" element={<Landing />} /> 
        <Route path="/agenda" element={<Agenda />} /> 
        
        {/* Registro y Login */}
        <Route path="/alta-usuario" element={<AltaUsuario />} />
        {/* Usamos el componente Registro.jsx para la ruta de iniciar sesión, ya que maneja la lógica de login/registro */}
        <Route path="/iniciar-sesion" element={<IniciarSesion />} /> 

        {/* --- B. Ruta de la Página Migrada (en raíz de pages/) --- */}
        <Route path="/sobre-nosotros" element={<Sobre />} /> 

        {/* --- C. Rutas Legales (Ahora con importaciones correctas) --- */}
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/politica-cookies" element={<PoliticaCookies />} />
        <Route path="/terminos-uso" element={<TerminosUso />} />
        
        {/* Ruta comodín para cualquier otra URL (opcional) */}
        <Route path="*" element={<div>Error 404: Página no encontrada.</div>} />

      </Routes>
    </BrowserRouter>
  )
}