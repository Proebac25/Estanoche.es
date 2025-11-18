// src/components/Header.jsx
export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-lg border-b border-white/10">
      <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">EstaNoche.es</h1>
          <p className="text-sm text-gray-400">Tu agenda de ocio</p>
        </div>
        <a href="mailto:proebac25@estanoche.es" className="bg-gradient-to-r from-pink-600 to-orange-500 px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition">
          Contacto
        </a>
      </div>
    </header>
  )
}