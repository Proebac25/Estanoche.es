// src/components/Footer.jsx
import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <footer style={{
      background: '#000000',
      padding: '2rem 1rem 1rem',
      marginTop: '3rem',
      textAlign: 'center',
      borderTop: '1px solid #333333',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Botón Inicio en el footer - SOLO si NO estamos en la página de inicio */}
        {!isHomePage && (
          <div style={{ marginBottom: '2rem' }}>
            <Link 
              to="/" 
              style={{ 
                background: 'linear-gradient(90deg,#F72585,#FFB703)', 
                color: 'white', 
                fontWeight: 'bold', 
                padding: '0.8rem 2rem', 
                borderRadius: '9999px', 
                textDecoration: 'none', 
                fontSize: '1rem' 
              }}
            >
              Inicio
            </Link>
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '3rem', 
          flexWrap: 'wrap', 
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          <Link to="/aviso-legal" style={{ color: '#FFB703', textDecoration: 'underline' }}>Aviso legal</Link>
          <Link to="/politica-privacidad" style={{ color: '#FFB703', textDecoration: 'underline' }}>Política de privacidad</Link>
          <Link to="/politica-cookies" style={{ color: '#FFB703', textDecoration: 'underline' }}>Política de cookies</Link>
          <Link to="/terminos-uso" style={{ color: '#FFB703', textDecoration: 'underline' }}>Términos y condiciones</Link>
        </div>

        <p style={{ 
          fontSize: '1.0rem', 
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