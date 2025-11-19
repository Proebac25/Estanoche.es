// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer style={{ 
      background: 'linear-gradient(to top, #000, transparent)', 
      padding: '6rem 1rem 3rem', 
      marginTop: '10rem',
      textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <a href="/pages/aviso-legal.html" style={{ color: '#FFB703', textDecoration: 'underline', fontSize: '1rem' }}>Aviso legal</a>
          <a href="/pages/politica-privacidad.html" style={{ color: '#FFB703', textDecoration: 'underline', fontSize: '1rem' }}>Política de privacidad</a>
          <a href="/pages/cookies.html" style={{ color: '#FFB703', textDecoration: 'underline', fontSize: '1rem' }}>Política de cookies</a>
          <a href="/pages/terminos-uso.html" style={{ color: '#FFB703', textDecoration: 'underline', fontSize: '1rem' }}>Térm  y condiciones</a>
        </div>
        <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
          www.estanoche.es © Proebac25 Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}