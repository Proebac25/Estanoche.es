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
import BajaUsuario from "./pages/auth/BajaUsuario.jsx";
import RecuperarPassword from "./pages/auth/RecuperarPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

import PanelPromotor from "./pages/promotor/Panel.jsx";
import FichaPromotor from "./pages/promotor/FichaP.jsx";

import PanelCliente from "./pages/cliente/Panel.jsx";
import FichaCliente from "./pages/cliente/FichaC.jsx";

import EntidadesList from "./pages/entidades/EntidadesList.jsx";
import EntidadForm from "./pages/entidades/EntidadForm.jsx";
import EntidadDetalle from "./pages/entidades/EntidadDetalle.jsx";

import EventosList from "./pages/eventos/EventosList.jsx";
import EventoForm from "./pages/eventos/EventoForm.jsx";

import SEO from "./components/SEO.jsx"; // <-- Importar SEO

export default function AppRoutes() {
  return (
    <>
      {/* SEO Global por defecto (si una página no tiene el suyo propio, usará este o se mezclará) */}
      <SEO />

      <Routes>
        {/* Ruta principal PÚBLICA (Ahora es Sobre) */}
        <Route path="/" element={
          <>
            <SEO
              title="Sobre Nosotros"
              description="Bienvenido a EstaNoche.es, tu agenda definitiva de ocio nocturno."
            />
            <Sobre />
          </>
        } />

        {/* Landing Page REAL (Protegida) */}
        <Route
          path="/landing"
          element={
            <AccessGuard>
              <SEO
                title="Agenda"
                description="Explora los mejores eventos y fiestas de esta noche."
              />
              <Landing />
            </AccessGuard>
          }
        />

        {/* Rutas legales */}
        <Route path="/legal/cookies" element={
          <>
            <SEO title="Política de Cookies" />
            <PoliticaCookies />
          </>
        } />
        <Route path="/legal/aviso-legal" element={
          <>
            <SEO title="Aviso Legal" />
            <AvisoLegal />
          </>
        } />
        <Route path="/legal/privacidad" element={
          <>
            <SEO title="Política de Privacidad" />
            <PoliticaPrivacidad />
          </>
        } />
        <Route path="/legal/terminos" element={
          <>
            <SEO title="Términos de Uso" />
            <TerminosUso />
          </>
        } />

        {/* Ruta explícita para Sobre (redirige a /) */}
        <Route path="/sobre" element={<Navigate to="/" replace />} />

        {/* Rutas de registro y acceso */}
        <Route path="/AltaUsuario" element={<AltaUsuario />} />
        <Route path="/VerificacionEmail" element={<VerificacionEmail />} />
        <Route path="/VerificacionSMS" element={<VerificacionSMS />} />
        <Route path="/ConfirmarTelefono" element={<ConfirmarTelefono />} />
        <Route path="/RegistroMovil" element={<RegistroMovil />} />
        <Route path="/RegistroEmail" element={<RegistroEmail />} />
        <Route path="/BajaUsuario" element={<BajaUsuario />} />
        <Route path="/RecuperarPassword" element={<RecuperarPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />

        {/* Rutas de Promotor */}
        <Route path="/RegistroPromotor" element={<PanelPromotor />} />
        <Route path="/promotor/ficha" element={<FichaPromotor />} />
        <Route path="/FichaPromotor" element={<FichaPromotor />} /> {/* Alias */}

        {/* Rutas de Cliente */}
        <Route path="/RegistroCliente" element={<PanelCliente />} />
        <Route path="/FichaUsuario" element={<FichaCliente />} />

        {/* Rutas de Entidades */}
        <Route path="/entidades" element={<EntidadesList />} />
        <Route path="/entidad/nueva" element={<EntidadForm />} />
        <Route path="/entidad/:id" element={<EntidadDetalle />} />
        <Route path="/entidad/:id/editar" element={<EntidadForm />} />

        {/* Rutas pendientes de implementar (placeholders) */}
        {/* Rutas de Eventos */}
        {/* 
        <Route path="/agenda" element={<Agenda />} />
        */}
        <Route path="/eventos" element={<EventosList />} />
        <Route path="/evento/nuevo" element={<EventoForm />} />
        {/* <Route path="/evento/:id" element={<EventoDetalle />} /> */}
        <Route path="/evento/:id/editar" element={<EventoForm />} />
        {/*
        <Route path="/productor/perfil" element={<PerfilProductor />} />
        <Route path="/productor/eventos" element={<EventosProductor />} />
        <Route path="/productor/entidades" element={<EntidadesProductor />} />
        <Route path="/cliente/perfil" element={<PerfilCliente />} />
        */}
      </Routes>
    </>
  );
}