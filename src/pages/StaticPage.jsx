import Header from '../components/Header'
import Footer from '../components/Footer'

export default function StaticPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
      <Header />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-white text-center">
          <h1 className="text-5xl font-bold mb-8">Página en construcción</h1>
          <p className="text-xl">Esta página será migrada a React próximamente.</p>
          <a href="/" className="inline-block mt-8 bg-gradient-to-r from-pink-600 to-orange-500 px-12 py-4 rounded-full text-xl font-bold hover:scale-105 transition">
            ← Volver al inicio
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
