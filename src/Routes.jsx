import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/landing/Landing.jsx";
import AvisoLegal from "./pages/legal/AvisoLegal.jsx";
import PoliticaCookies from "./pages/legal/PoliticaCookies.jsx";
import PoliticaPrivacidad from "./pages/legal/PoliticaPrivacidad.jsx";
import TerminosUso from "./pages/legal/TerminosUso.jsx";
import Sobre from "./pages/sobre/Sobre.jsx";
import AccessGuard from "./components/AccessGuard.jsx";

// Importar las rutas reorganizadas
import AltaUsuario from "./pages/auth/AltaUsuario.jsx";
import VerificacionEmail from "./pages/auth/VerificacionEmail.jsx";
import VerificacionSMS from "./pages/auth/VerificacionSMS.jsx";
import ConfirmarTelefono from "./pages/auth/ConfirmarTelefono.jsx";
import RegistroMovil from "./pages/auth/RegistroMovil.jsx";
import RegistroEmail from "./pages/auth/RegistroEmail.jsx";

import PanelPromotor from "./pages/promotor/Panel.jsx";
import FichaPromotor from "./pages/promotor/FichaP.jsx";

import PanelCliente from "./pages/cliente/Panel.jsx";
import FichaCliente from "./pages/cliente/FichaC.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Ruta principal PÚBLICA (Ahora es Sobre) */}
      <Route path="/" element={<Sobre />} />

      {/* Landing Page REAL (Protegida) */}
      <Route
        path="/landing"
        element={
          <AccessGuard>
            <Landing />
          </AccessGuard>
        }
      />

      {/* Rutas legales */}
      <Route path="/legal/cookies" element={<PoliticaCookies />} />
      <Route path="/legal/aviso-legal" element={<AvisoLegal />} />
      <Route path="/legal/privacidad" element={<PoliticaPrivacidad />} />
      <Route path="/legal/terminos" element={<TerminosUso />} />

      {/* Ruta explícita para Sobre (redirige a /) */}
      <Route path="/sobre" element={<Navigate to="/" replace />} />

      {/* Rutas de registro y acceso */}
      <Route path="/AltaUsuario" element={<AltaUsuario />} />
      <Route path="/VerificacionEmail" element={<VerificacionEmail />} />
      <Route path="/VerificacionSMS" element={<VerificacionSMS />} />
      <Route path="/ConfirmarTelefono" element={<ConfirmarTelefono />} />
      <Route path="/RegistroMovil" element={<RegistroMovil />} />
      <Route path="/RegistroEmail" element={<RegistroEmail />} />

      {/* Rutas de Promotor */}
      <Route path="/RegistroPromotor" element={<PanelPromotor />} />
      <Route path="/promotor/ficha" element={<FichaPromotor />} />
      <Route path="/FichaPromotor" element={<FichaPromotor />} /> {/* Alias */}

      {/* Rutas de Cliente */}
      <Route path="/RegistroCliente" element={<PanelCliente />} />
      <Route path="/FichaUsuario" element={<FichaCliente />} />

      {/* Rutas pendientes de implementar (placeholders) */}
      {/* 
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/eventos" element={<EventosList />} />
      <Route path="/evento/nuevo" element={<EventoForm />} />
      <Route path="/evento/:id" element={<EventoDetalle />} />
      <Route path="/evento/:id/editar" element={<EventoForm />} />
      <Route path="/entidades" element={<EntidadesList />} />
      <Route path="/entidad/nueva" element={<EntidadForm />} />
      <Route path="/entidad/:id" element={<EntidadDetalle />} />
      <Route path="/entidad/:id/editar" element={<EntidadForm />} />
      <Route path="/productor/perfil" element={<PerfilProductor />} />
      <Route path="/productor/eventos" element={<EventosProductor />} />
      <Route path="/productor/entidades" element={<EntidadesProductor />} />
      <Route path="/cliente/perfil" element={<PerfilCliente />} />
      */}
    </Routes>
  );
}