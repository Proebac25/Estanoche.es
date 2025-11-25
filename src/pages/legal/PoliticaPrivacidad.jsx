import React from 'react';
import LegalBase from './LegalBase.jsx';

export default function PoliticaPrivacidad() {
  return (
    <LegalBase title="Política de Privacidad">
      <p>
        Conforme al RGPD (UE 2016/679) y LOPDGDD 3/2018:
        <br/><br/>
        <strong class="legal-strong">Responsable:</strong> Miguel García (Proebac25)<br/>
        <strong class="legal-strong">Email:</strong> proebac25@estanoche.es
      </p>

      <h2 style={{ marginTop:20 }}>Datos recogidos</h2>
      <ul class="legal-list">
        <li>Email voluntario.</li>
        <li>Datos técnicos: IP, dispositivo, estadísticas.</li>
        <li>Datos de promotores de eventos.</li>
      </ul>

      <h2 style={{ marginTop:20 }}>Finalidades</h2>
      <ul class="legal-list">
        <li>Gestión del servicio y comunicaciones.</li>
        <li>Seguridad y experiencia del usuario.</li>
      </ul>

      <h2 style={{ marginTop:20 }}>Derechos</h2>
      <p>Acceso, rectificación, supresión, oposición, portabilidad. Solicitudes vía email.</p>
    </LegalBase>
  );
}
