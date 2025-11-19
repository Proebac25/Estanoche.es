// src/components/Landing.jsx
import { useEffect, useRef } from 'react'
import Footer from './Footer.jsx'  // ← IMPORTADO

export default function Landing() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
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
      {/* Fondo degradado */}
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #3C3C8A, #1C1C3A 40%, #F72585)', backgroundSize: '200% 200%', animation: 'g 20s ease infinite', zIndex: -2 }} />
      <style jsx>{`@keyframes g { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }`}</style>

      {/* Canvas estrellas */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.6 }} />

      {/* Header */}
      <header style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '1.8rem' }}>EstaNoche.es</div>
          <div style={{ fontSize: '0.9rem', color: '#B3B3B3' }}>Tu agenda de ocio</div>
        </div>
        <a href="mailto:proebac25@estanoche.es" style={{ background: 'linear-gradient(90deg,#F72585,#FFB703)', color: 'white', fontWeight: 'bold', padding: '0.8rem 2rem', borderRadius: '9999px', textDecoration: 'none', fontSize: '0.9rem' }}>Contacto</a>
      </header>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '50rem', width: '100%', position: 'relative' }}>

          {/* MARCA DE AGUA */}
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', opacity: 0.20, color: 'white', fontWeight: 800, fontSize: 'clamp(2rem,12vw,6rem)', lineHeight: 1.1, textAlign: 'center', width: '100%' }}>
            <br/>Especial<br/>Zambombas de Jerez.<br/>Disponible en Breve
          </div>

          {/* ICONO ZAMBOMBA – RUTA CORRECTA */}
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>
            🌙 <img src="/assets/Icon_Zambomba.png" alt="Zambomba" style={{ width: '2.2em', height: '2.2em', verticalAlign: 'middle' }} />
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }}>
            Descubre el ocio<br/>
            <span style={{ background: 'linear-gradient(90deg,#FFB703,#F72585)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>de tu ciudad</span>
          </h1>

          <p style={{ fontSize: '1.4rem', opacity: 0.9, marginBottom: '3rem' }}>
            Conciertos, eventos y planes únicos. Sin descargas. Sin complicaciones.
          </p>

          <a href="/pages/agenda.html" style={{ background: 'linear-gradient(90deg,#F72585,#FFB703)', color: 'white', fontWeight: 'bold', padding: '1.5rem 4.5rem', borderRadius: '9999px', textDecoration: 'none', fontSize: '1.4rem', display: 'inline-block' }}>
            Ver eventos
          </a>

          <div style={{ margin: '2rem 0 4rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/pages/alta_usuario.html" style={{ background: 'linear-gradient(90deg,#F72585,#FFB703)', color: 'white', fontWeight: 'bold', padding: '1rem 3rem', borderRadius: '9999px', textDecoration: 'none' }}>Registrarse</a>
            <a href="/pages/registro-usuario.html" style={{ background: 'linear-gradient(90deg,#F72585,#FFB703)', color: 'white', fontWeight: 'bold', padding: '1rem 3rem', borderRadius: '9999px', textDecoration: 'none' }}>Iniciar sesión</a>
          </div>

          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>Descubre quiénes somos y por qué lo hacemos</h2>
            <a href="/pages/sobre.html" style={{ background: 'linear-gradient(90deg,#F72585,#FFB703)', color: 'white', fontWeight: 'bold', padding: '1.2rem 3.5rem', borderRadius: '9999px', textDecoration: 'none', fontSize: '1.2rem' }}>Sobre nosotros</a>
          </div>

        </div>
      </section>

      {/* FOOTER IMPORTADO */}
      <Footer />

    </>
  )
}