// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-black/80 backdrop-blur-lg py-12 mt-24 border-t border-white/10">
      <div className="container max-w-6xl mx-auto px-4 text-center">
        {/* Enlaces legales */}
        <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm">
          <a href="/pages/aviso-legal.html" className="text-yellow-400 hover:underline">Aviso legal</a>
          <a href="/pages/politica-privacidad.html" className="text-yellow-400 hover:underline">Política de privacidad</a>
          <a href="/pages/cookies.html" className="text-yellow-400 hover:underline">Política de cookies</a>
          <a href="/pages/terminos-uso.html" className="text-yellow-400 hover:underline">Términos y condiciones</a>
        </div>

        {/* Texto copyright exacto como tú lo quieres */}
        <p className="text-white text-sm font-medium">
          www.estanoche.es. © Proebac25 Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}