// src/Routes.jsx (VERSIÓN CORREGIDA)
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Sobre from './pages/Sobre.jsx';
import Agenda from './pages/agenda/Agenda.jsx';
import AvisoLegal from './pages/legal/AvisoLegal.jsx';
import PoliticaPrivacidad from './pages/legal/PoliticaPrivacidad.jsx';
import PoliticaCookies from './pages/legal/PoliticaCookies.jsx';
import TerminosUso from './pages/legal/TerminosUso.jsx';
import AltaUsuario from './pages/registro/AltaUsuario.jsx';
import Registro from './pages/registro/Registro.jsx';
import IniciarSesion from './pages/registro/IniciarSesion.jsx';
import ImportarZambombas from './pages/Admin/ImportarZambombas.jsx';
import StaticPage from './pages/StaticPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/alta-usuario" element={<AltaUsuario />} />
      <Route path="/iniciar-sesion" element={<IniciarSesion />} />
      <Route path="/aviso-legal" element={<AvisoLegal />} />
      <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
      <Route path="/politica-cookies" element={<PoliticaCookies />} />
      <Route path="/terminos-uso" element={<TerminosUso />} />
      <Route path="/importar-local" element={<ImportarZambombas />} />
      <Route path="/:slug" element={<StaticPage />} />
      <Route path="*" element={<StaticPage />} />
    </Routes>
  );
}