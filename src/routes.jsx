import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import AvisoLegal from './pages/legal/AvisoLegal';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/legal/aviso-legal" element={<AvisoLegal />} />
  </Routes>
);

export default AppRoutes;


