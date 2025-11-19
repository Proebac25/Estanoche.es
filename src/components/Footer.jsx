// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer style={{
      background: '#000000',           // NEGRO PURO
      padding: '3rem 1rem 3rem',       // GRANDE
      marginTop: '1rem',               // ESPACIO ARRIBA
      textAlign: 'center',
      borderTop: '1px solid #333333',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '3rem', 
          flexWrap: 'wrap', 
          marginBottom: '3rem',
          fontSize: '1.1rem'
        }}>
          <a href="/pages/aviso-legal.html" style={{ color: '#FFB703', textDecoration: 'underline' }}>Aviso legal</a>
          <a href="/pages/politica-privacidad.html" style={{ color: '#FFB703', textDecoration: 'underline' }}>Política de privacidad</a>
          <a href="/pages/cookies.html" style={{ color: '#FFB703', textDecoration: 'underline' }}>Política de cookies</a>
          <a href="/pages/terminos-uso.html" style={{ color: '#FFB703', textDecoration: 'underline' }}>Términos y condiciones</a>
        </div>

        <p style={{ 
          fontSize: '1.4rem', 
          fontWeight: 'bold', 
          color: 'white',
          letterSpacing: '0.5px'
        }}>
          www.estanoche.es © Proebac25 Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}