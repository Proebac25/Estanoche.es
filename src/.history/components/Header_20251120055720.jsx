import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-lg border-b border-white/10">
      <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4">
          <img src="/Assets/Icon_Zambomba.png" alt="EstaNoche.es" className="h-12 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-white">EstaNoche.es</h1>
            <p className="text-xs text-gray-400">Especial Zambombas de Jerez</p>
          </div>
        </Link>
        <a href="mailto:proebac25@estanoche.es" className="bg-gradient-to-r from-pink-600 to-orange-500 px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition">
          Contacto
        </a>
      </div>
    </header>
  )
}
