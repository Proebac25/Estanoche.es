export default function Agenda() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 relative">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-8">¡Bienvenido a la Agenda!</h1>
          <p className="text-xl text-gray-200 mb-10">
            Aquí aparecerán todos los eventos de tu zona
          </p>
          <div className="bg-white/20 rounded-2xl p-12">
            <p className="text-2xl text-white font-semibold">
              Próximamente...
            </p>
          </div>
          <footer className="mt-16">
            <div className="text-center text-gray-400 text-sm">
              © 2025 Proebac · Todos los derechos reservados
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

