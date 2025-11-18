export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md border-t border-white/10">
      <div className="flex justify-between items-center px-8 py-4">
        <a href="/" className="bg-white/20 hover:bg-white/30 px-8 py-3 rounded-full text-white font-bold transition">
          Salir
        </a>
        <button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 px-12 py-3 rounded-full text-white font-bold transition">
          Guardar
        </button>
      </div>
      <div className="text-center text-gray-400 text-sm pb-3">
        © 2025 Proebac · Todos los derechos reservados
      </div>
    </footer>
  )
}