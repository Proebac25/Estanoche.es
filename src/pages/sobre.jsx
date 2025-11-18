import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Sobre() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
      <Header />
      <main className="pt-32 pb-20 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-12">Sobre nosotros</h1>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-left space-y-6">
            <p className="text-lg leading-relaxed">
              EstaNoche.es es una PWA innovadora dedicada a centralizar el ocio nocturno y cultural de tu ciudad.
            </p>
            <p className="text-lg leading-relaxed">
              Gratuita, sin registro obligatorio, sin descargas. Solo abre el navegador y disfruta.
            </p>
            <div className="text-center mt-10">
              <a href="/" className="inline-block bg-gradient-to-r from-pink-600 to-orange-500 px-12 py-5 rounded-full text-xl font-bold hover:scale-105 transition">
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

