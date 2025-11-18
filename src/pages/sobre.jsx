import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Sobre() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
      <Header />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            EstaNoche.es
          </h1>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 text-white space-y-6 text-lg leading-relaxed text-left">
            <p>EstaNoche.es es una <strong>PWA innovadora</strong> dedicada a centralizar y facilitar el descubrimiento de opciones de ocio nocturno y cultural.</p>
            <p>Lanzada como una herramienta gratuita y accesible, su propósito principal es actuar como una <strong>agenda unificada de eventos</strong>, eliminando la necesidad de navegar por múltiples apps o sitios dispersos.</p>
            <p>Dirigida a un público interesado en planes locales –desde conciertos y fiestas hasta actividades culturales o deportivas–, promueve el entretenimiento sin barreras: <strong>no requiere registro, descargas ni pagos</strong> para explorar contenido.</p>
            <p>Por su desarrollo permite una experiencia fluida en móviles, tablet y desktops, con instalación opcional para acceso offline.</p>

            <h2 className="text-3xl font-bold text-[#FFB703] mt-10 mb-6">Características clave</h2>
            <ul className="space-y-3 text-lg">
              <li>• Agenda de eventos con todo tipo de ocio</li>
              <li>• Búsquedas selectivas con filtros</li>
              <li>• Formulario gratuito para creadores</li>
              <li>• Acceso inmediato sin redes dispersas</li>
            </ul>

            <div className="text-center mt-12">
              <a href="/" className="inline-block bg-gradient-to-r from-[#F72585] to-[#FFB703] text-white font-bold py-4 px-10 rounded-full text-xl hover:scale-105 transition">
                ← Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}