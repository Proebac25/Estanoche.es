// src/pages/sobre/Sobre.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Importar videos (asegúrate de tenerlos en src/assets/videos/)
import V1 from '../../assets/videos/V1.mp4';
import V2 from '../../assets/videos/V2.mp4';
import V3 from '../../assets/videos/V3.mp4';

const Sobre = () => {
  const { theme } = useTheme();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const videos = [V1, V2, V3];

  // Manejar bucle de videos
  useEffect(() => {
    if (!isPlaying) return;

    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    video.addEventListener('ended', handleVideoEnd);

    // Cargar y reproducir video actual
    video.load();
    video.play().catch(e => console.log("Autoplay prevented:", e));

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [currentVideoIndex, isPlaying, videos.length]);

  // Detener/reanudar todos los videos
  const handleStopPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(e => console.log("Play failed:", e));
      setIsPlaying(true);
    }
  };

  // Cambiar a video específico
  const goToVideo = (index) => {
    setCurrentVideoIndex(index);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  // Colores según tema
  const textColor = theme === 'night' ? '#FFFFFF' : '#1E2933';
  const mutedColor = theme === 'night' ? 'rgba(255, 255, 255, 0.7)' : '#666666';
  const cardBg = theme === 'night'
    ? 'rgba(30, 30, 30, 0.9)'
    : 'rgba(255, 255, 255, 0.9)';
  const borderColor = theme === 'night'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)';

  const strongStyle = { color: '#d4a15a' };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme === 'night' ? '#060712' : '#F9F7F4',
      color: textColor,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header básico */}
      <Header theme={theme} />

      {/* Contenido principal */}
      <main style={{ flex: 1 }}>
        {/* SECCIÓN HERO con video y texto corporativo */}
        <section style={{
          position: 'relative',
          padding: '0rem 0rem 0rem 0rem', // "One line" (approx 1rem) from header
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          minHeight: '85vh'
        }}>
          {/* Video background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            overflow: 'hidden',
            // No background color to ensure transparency
          }}>
            <video
              ref={videoRef}
              key={currentVideoIndex}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', // Changed to cover to fill width in landscape
                opacity: 0.8
              }}
              muted
              playsInline
              autoPlay
            >
              <source src={videos[currentVideoIndex]} type="video/mp4" />
              Tu navegador no soporta videos.
            </video>

            {/* Overlay para mejor legibilidad */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: theme === 'night'
                ? 'linear-gradient(to bottom, rgba(6, 7, 18, 0.2), rgba(6, 7, 18, 0.4))'
                : 'linear-gradient(to bottom, rgba(249, 247, 244, 0.0), rgba(249, 247, 244, 0.0))'
            }} />
          </div>

          {/* Contenido sobre el video */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '1200px',
            textAlign: 'center',
            padding: '1rem' // Reduced padding here too
          }}>
            <h1 style={{
              fontSize: 'clamp(1.6rem, 5vw, 3.3rem)',
              fontWeight: 700,
              marginBottom: '1.5rem',
              background: 'linear-gradient(90deg, #F72585, #FFB703)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
              wordBreak: 'break-word'
            }}>
              <strong>EstaNoche.es</strong>
            </h1>

            <p style={{
              fontSize: 'clamp(0.85rem, 2.7vw, 1rem)',
              lineHeight: 1.5,
              marginBottom: '2rem',
              color: '#FFFFFF',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              maxWidth: '90%',
              margin: '0 auto 2rem auto'
            }}>
              <strong>Estamos trabajando para crear
                una agenda que concentre los eventos, conciertos,
                fiestas y actividades culturales de tu ciudad.<br />
                Gratis, sin registro, accesible
                desde cualquier dispositivo.</strong>
            </p>

            {/* Controles de video (Solo puntos) */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '1rem', // Reduced margin
              flexWrap: 'wrap'
            }}>
              {/* REMOVED: Pause button */}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToVideo(index)}
                    style={{
                      width: '10px', // Slightly smaller
                      height: '10px',
                      borderRadius: '50%',
                      background: currentVideoIndex === index
                        ? '#FFB703'
                        : 'rgba(255, 255, 255, 0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    aria-label={`Ver video ${index + 1}`}
                  />
                ))}
              </div>

              {/* REMOVED: Video counter text */}
            </div>
          </div>
        </section >

        {/* SECCIÓN CONTENIDO (del Sobre.jsx original) */}
        < section style={{
          padding: '0 1rem 2rem 1rem', // Reduced top padding to 0 to be "pegado"
          maxWidth: '1000px', // Increased from 768px to fit larger text better
          margin: '0 auto'
        }}>
          <div style={{
            // Removed background, backdropFilter, border, boxShadow to be transparent
            padding: '0', // Set to 0 so the only gap is the 1rem from Hero
          }}>
            <h1 style={{
              color: '#FFB703',
              fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
              marginBottom: '1rem',
              textAlign: 'center',
              fontWeight: 900
            }}>
              La plataforma
            </h1>

            <div style={{
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              lineHeight: 1.6
            }}>
              <p>
                EstaNoche.es es una <strong style={strongStyle}>plataforma independiente</strong> que conecta a las personas
                con los mejores planes de la ciudad. Eventos creados por locales,
                artistas y promotores que apuestan por un ocio diferente.
              </p>

              <p>
                Si eres <strong style={strongStyle}>promotor, aprovecha la oportunidad que te brinda ESTANOCHE.ES </strong>para dar a conocer
                tu evento, tendrán acceso todos los usuarios de la aplicación que busquen ocio en la ciudad.
                Podrán elegir <strong style={strongStyle}>seguir tus Eventos y ser Notificados </strong>de cada convocatoria.
              </p>

              <p>Ya seas artista, dueño de un local, organizador de eventos o promotor que apuesta por un ocio diferente, usa
                <strong style={strongStyle}> EstaNoche.es, la herramienta ideal para darte a conocer.</strong>
              </p>

              <p>
                Su propósito principal es actuar como una{' '}
                <strong style={strongStyle}>agenda unificada de eventos</strong>,
                eliminando la necesidad de navegar por múltiples apps o sitios dispersos para encontrar lo que busca.
              </p>

              <p>
                <strong style={strongStyle}>Multiplataforma, innovadora y gratuita,</strong>
                facilita a sus usuarios el acceso a opciones de ocio en cualquier ciudad.
              </p>


              <p>
                ¿Quieres en encontrar planes en cualquier ciudad, entretenimiento sin barreras?
                Muy pronto la podrás probar{' '}
                <strong style={strongStyle}> no requiere registro, descargas ni pagos.</strong>
                {' '}
              </p>

              <p>
                Por su desarrollo permite una experiencia fluida en móviles,
                tablet y desktops, de cualquier sistema, con instalación opcional para acceso offline.
              </p>

              <h2 style={{
                color: '#FFB703',
                fontSize: 'clamp(1rem, 3vw, 1.4rem)',
                margin: '1.5rem 0 1rem',
                fontWeight: 700
              }}>
                Características clave
              </h2>

              <ul style={{
                marginLeft: '1rem',
                marginBottom: '1rem',
                listStyleType: 'none',
                padding: 0
              }}>
                {[
                  '📅 Agenda de eventos con todo tipo de ocio',
                  '🔍 Búsquedas selectivas con filtros avanzados',
                  '📝 Formulario gratuito para creadores',
                  '🚀 Acceso inmediato sin apps dispersas'
                ].map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem', paddingLeft: '0' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section >
      </main >

      {/* Footer */}
      < Footer />
    </div >
  );
};

export default Sobre;