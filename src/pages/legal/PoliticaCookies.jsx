import React from 'react';
import LegalBase from './LegalBase.jsx';

export default function PoliticaCookies() {
  return (
    <LegalBase title="Política de Cookies">
      <p>EstaNoche.es utiliza cookies esenciales y analíticas.</p>

      <h2 style={{ marginTop:20 }}>Tipos de cookies</h2>
      <ul class="legal-list">
        <li><strong class="legal-strong">Técnicas:</strong> Necesarias para que la web funcione.</li>
        <li><strong class="legal-strong">Analíticas:</strong> Estadísticas anónimas.</li>
      </ul>

      <h2 style={{ marginTop:20 }}>Gestión de cookies</h2>
      <p>El usuario puede bloquear o eliminar cookies desde su navegador.</p>

      <h2 style={{ marginTop:20 }}>Contacto</h2>
      <p><strong class="legal-strong">proebac25@estanoche.es</strong></p>
    </LegalBase>
  );
}
