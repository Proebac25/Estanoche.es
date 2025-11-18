// src/inline-scripts.js
// Moved from inline index.html to avoid Vite html-proxy issues.

const observer = new MutationObserver(() => {
  const btn = document.getElementById('btn-sobre-nosotros');
  if (btn && !btn.dataset.listenerAdded) {
    btn.dataset.listenerAdded = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      history.pushState({ page: 'sobre' }, 'Sobre nosotros - EstaNoche.es', '/sobre');
      document.title = 'Sobre nosotros - EstaNoche.es';

      document.body.innerHTML = `
        <div style="background:#121212; color:white; min-height:100vh; padding:2rem 1rem; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Inter',sans-serif;">
          <div class="container" style="max-width:42rem; margin:0 auto; text-align:center;">
            <h1 style="font-size:2.8rem; margin-bottom:2rem; font-family:'Playfair Display',serif;">
              EstaNoche.es
            </h1>
            <div style="font-size:1.25rem; line-height:1.9; text-align:left; background:rgba(255,255,255,0.04); padding:2.5rem; border-radius:1.5rem;">
              <p style="margin-bottom:1.5rem;">EstaNoche.es es una <strong>PWA innovadora</strong> dedicada a centralizar y facilitar el descubrimiento de opciones de ocio nocturno y cultural.</p>
              <p style="margin-bottom:1.5rem;">Lanzada como una herramienta gratuita y accesible, su propósito principal es actuar como una <strong>agenda unificada de eventos</strong>, eliminando la necesidad de navegar por múltiples apps o sitios dispersos.</p>
              <p style="margin-bottom:1.5rem;">Dirigida a un público interesado en planes locales –desde conciertos y fiestas hasta actividades culturales o deportivas–, promueve el entretenimiento sin barreras: <strong>no requiere registro, descargas ni pagos</strong> para explorar contenido.</p>
              <p style="margin-bottom:2rem;">Por su desarrollo permite una experiencia fluida en móviles, tablet y desktops, con instalación opcional para acceso offline.</p>

              <h2 style="font-size:2rem; margin:2.5rem 0 1rem; color:#FFB703;">Características clave</h2>
              <ul style="text-align:left; margin:2rem auto; max-width:36rem;">
                <li>• Agenda de eventos con todo tipo de ocio</li>
                <li>• Búsquedas selectivas con filtros</li>
                <li>• Formulario gratuito para creadores</li>
                <li>• Acceso inmediato sin redes dispersas</li>
              </ul>

              <h2 style="font-size:2rem; margin:2.5rem 0 1rem; color:#F72585;">Conclusión</h2>
              <p style="margin-bottom:3rem;">EstaNoche.es es la alternativa fresca y local al ocio digital saturado, con actualización en tiempo real y usabilidad sin fricciones.</p>

              <button onclick="window.location.href='/'" class="btn-gradiente" style="padding:1rem 3rem; border-radius:9999px; border:none; cursor:pointer; font-size:1.2rem;">
                ← Volver al inicio
              </button>
            </div>
          </div>
        </div>
      `;
      window.scrollTo(0, 0);
    });

    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
