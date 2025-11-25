import React from 'react';
import LegalBase from './LegalBase.jsx';
import MainLayout from '../layouts/MainLayout.jsx';


export default function AvisoLegal() {
  return (
    <LegalBase title="Aviso Legal">
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002 (LSSI), se informa:
        <br/><br/>
        <strong class="legal-strong">Titular:</strong> Miguel García  (Proebac25)<br/>
        <strong class="legal-strong">Ciudad:</strong> Jerez de la Frontera, España<br/>
        <strong class="legal-strong">Email:</strong> proebac25@estanoche.es
      </p>

      <h2 style={{ marginTop:20 }}>Objeto</h2>
      <p>EstaNoche.es es una plataforma informativa de eventos y ocio.</p>

      <h2 style={{ marginTop:20 }}>Propiedad intelectual</h2>
      <p>Todos los contenidos están protegidos por ley. Prohibida la reproducción sin permiso.</p>

      <h2 style={{ marginTop:20 }}>Responsabilidad</h2>
      <p>No garantizamos la exactitud de contenidos publicados por terceros o de fuentes externas.</p>

      <h2 style={{ marginTop:20 }}>Jurisdicción</h2>
      <p>Juzgados de Jerez de la Frontera.</p>
    </LegalBase>
  );
}
