// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', padding: '4rem 1rem 2rem', marginTop: '8rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <a href="/pages/aviso-legal.html" style={{ color: '#FFB703', textDecoration: 'underline' }}>Aviso legal</a>
          <a href="/pages/politica-privacidad.html" style={{ color: '#FFB703', textDecoration: 'underline' }}>Política de privacidad</a>
          <a href="/pages/cookies.html" style={{ color: '#FFB703', textDecoration: 'underline' }}>Política de cookies</a>
          <a href="/pages/terminos-uso.html" style={{ color: '#FFB703', textDecoration: 'underline' }}>Términos y condiciones</a>
        </div>
        <p style={{ color: 'white', fontWeight: 'bold' }}>
          www.estanoche.es © Proebac25 Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}