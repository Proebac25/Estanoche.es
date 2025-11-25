import React from 'react';
import LegalBase from './LegalBase.jsx';

export default function TerminosUso() {
  return (
    <LegalBase title="Términos de Uso">
      <p>El acceso a EstaNoche.es implica aceptar estos términos.</p>

      <h2 style={{ marginTop:20 }}>Condiciones de uso</h2>
      <p>No se permite publicar contenido ilícito ni ofensivo.</p>

      <h2 style={{ marginTop:20 }}>Eventos</h2>
      <p>Los promotores son responsables de la veracidad de lo que publican.</p>

      <h2 style={{ marginTop:20 }}>Propiedad</h2>
      <p>Los contenidos están protegidos por propiedad intelectual.</p>

      <h2 style={{ marginTop:20 }}>Jurisdicción</h2>
      <p>Tribunales de Jerez de la Frontera.</p>
    </LegalBase>
  );
}
