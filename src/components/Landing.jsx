// src/components/Landing.jsx
import { useEffect, useRef } from 'react'
// import Footer from './Footer.jsx'   // ← IMPORTANTE

export default function Landing() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      a: Math.random()
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#FFB703'
      stars.forEach(s => {
        ctx.globalAlpha = s.a
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        s.a = 0.5 + Math.sin(Date.now() * 0.001 + s.x) * 0.5
      })
      requestAnimationFrame(draw)
    }
    draw()

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #3C3C8A, #1C1C3A 40%, #F72585)', backgroundSize: '200% 200%', animation: 'g 20s ease infinite', zIndex: -2 }} />
      <style jsx>{`@keyframes g { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }`}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.6 }} />

      {/* Cabecera Existente */}
      <header style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '1.8rem' }}>EstaNoche.es</div>
          <div style={{ fontSize: '0.9rem', color: '#B3B3B3' }}>Tu agenda de ocio</div>
        </div>
        <a href="mailto:proebac25@estanoche.es" style={{ background: 'linear-gradient(90deg,#F72585,#FFB703)', color: 'white', fontWeight: 'bold', padding: '0.8rem 2rem', borderRadius: '9999px', textDecoration: 'none', fontSize: '0.9rem' }}>Contacto</a>
      </header>

      {/* BLOQUE DE TEXTO DESLIZANTE (TICKER) - TRANSPARENTE Y H2 */}
      <div className="ticker-container" style={{ overflow: 'hidden', position: 'relative', zIndex: 10, padding: '0.5rem 0' }}>
        <div className="ticker-content" style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'marquee 25s linear infinite' }}>
          <span style={{ padding: '0 2rem', fontWeight: 'bold', fontSize: '2.0rem', color: '#FFB703' }}>
            🎉 ESPECIAL ZAMBOMBAS DE JEREZ - ¡EVENTOS Y PLANES DISPONIBLES EN BREVE! 🎉
          </span>
          <span style={{ padding: '0 2rem', fontWeight: 'bold', fontSize: '2.0rem', color: '#FFB703' }}>
            🎉 ESPECIAL ZAMBOMBAS DE JEREZ - ¡EVENTOS Y PLANES DISPONIBLES EN BREVE! 🎉
          </span>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      {/* FIN DEL NUEVO BLOQUE */}

      {/* 🚀 CORRECCIÓN AQUÍ: Eliminado minHeight: '100vh' y añadido paddingBottom: '4rem' */}
      <section style={{ display: 'block', textAlign: 'center', position: 'relative', paddingTop: '2rem', paddingBottom: '4rem' }}>
        
        {/* Este div está centrado con margin: '0 auto' */}
        <div style={{ maxWidth: '50rem', width: '100%', position: 'relative', margin: '0 auto' }}>
          
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>
            🌙 <img src="/imagenes/Icon_Zambomba.png" alt="Zambomba" style={{ width: '1.8em', height: '1.8em', verticalAlign: 'middle' }} />
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }}>
            Descubre el ocio<br/>
            <span style={{ background: 'linear-gradient(90deg,#FFB703,#F72585)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>de tu ciudad</span>
          </h1>

          <p style={{ fontSize: '2rem', opacity: 0.9, marginBottom: '3rem' }}>
            Conciertos, eventos y planes únicos. Sin descargas. Sin complicaciones.
          </p>

          <a href="/pages/agenda.html" style={{ background: 'linear-gradient(90deg,#F72585,#FFB703)', color: 'white', fontWeight: 'bold', padding: '1.5rem 4.5rem', borderRadius: '9999px', textDecoration: 'none', fontSize: '1.4rem', display: 'inline-block' }}>
            Ver eventos
          </a>

          <div style={{ margin: '2rem 0 4rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/pages/alta_usuario.html" style={{ background: 'linear-gradient(90deg,#F72585,#FFB703)', color: 'white', fontWeight: 'bold', padding: '1rem 3rem', borderRadius: '9999px', textDecoration: 'none' }}>Registrarse</a>
            <a href="/pages/registro-usuario.html" style={{ background: 'linear-gradient(90deg,#F72585,#FFB703)', color: 'white', fontWeight: 'bold', padding: '1rem 3rem', borderRadius: '9999px', textDecoration: 'none' }}>Iniciar sesión</a>
          </div>

          {/* Último grupo de botones */}
          <div style={{ marginTop: '1rem' }}>
            <h2 style={{ fontSize: '2.0rem', marginBottom: '3rem' }}>
              Descubre quiénes somos y por qué lo hacemos
            </h2>
            <a href="/pages/sobre.html" style={{ background: 'linear-gradient(90deg,#F72585,#FFB703)', color: 'white', fontWeight: 'bold', padding: '1.2rem 3.5rem', borderRadius: '9999px', textDecoration: 'none', fontSize: '1.2rem' }}>
              Sobre nosotros
            </a>
          </div>

        </div>
      </section>

      {/* Footer se colocará justo después del padding-bottom de 4rem de la sección */}
     // <Footer />
    </>
  )
}