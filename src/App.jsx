# Corregir el import en app.jsx (una sola línea)
@'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AltaUsuario from "./pages/AltaUsuario.jsx";
import CrearLocalOGrupo from "./pages/CrearLocalOGrupo.jsx";
import Agenda from "./pages/Agenda.jsx";
import StaticPage from "./pages/StaticPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AltaUsuario />} />
        <Route path="/crear_local_o_grupo" element={<CrearLocalOGrupo />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/sobre" element {<StaticPage />} />
        <Route path="/legal" element={<StaticPage />} />
        <Route path="/privacidad" element={<StaticPage />} />
        <Route path="/cookies" element={<StaticPage />} />
        <Route path="/terminos"  element={<StaticPage />} />
      </Routes>
    </BrowserRouter>
  );
}
'@ > src/app.jsx