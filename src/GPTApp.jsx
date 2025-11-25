import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas cargadas de forma perezosa
const Index = lazy(() => import("./pages/Index.jsx"));

// Puedes añadir más páginas aquí cuando las vayas creando:
// const Agenda = lazy(() => import("./pages/agenda/Agenda.jsx"));
// const Calendario = lazy(() => import("./pages/agenda/Calendario.jsx"));
// const CrearEvento = lazy(() => import("./pages/events/CrearEvento.jsx"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 20 }}>Cargando…</div>}>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Ejemplo de rutas futuras:
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/crear-evento" element={<CrearEvento />} />
          */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}



