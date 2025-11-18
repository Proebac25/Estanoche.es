export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-md border-b border-white/10 z-50">
      <div className="flex justify-between items-center px-8 py-4">
        <div>
          <div className="text-xl font-bold text-white">EstaNoche.es</div>
          <div className="text-xs text-gray-400">Tu agenda de ocio</div>
        </div>
        <a href="mailto:proebac25@estanoche.es" className="bg-gradient-to-r from-pink-500 to-orange-500 px-6 py-2 rounded-full text-white text-sm font-bold hover:opacity-90 transition">
          Contacto
        </a>
      </div>
    </header>
  )
}