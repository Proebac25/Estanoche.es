// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-lg py-10 mt-20">
      <div className="container max-w-6xl mx-auto px-4 text-center">
        {/* Enlaces legales */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
          <a href="/pages/aviso-legal.html" className="text-yellow-400 hover:underline">Aviso legal</a>
          <a href="/pages/politica-privacidad.html" className="text-yellow-400 hover:underline">Política de privacidad</a>
          <a href="/pages/cookies.html" className="text-yellow-400 hover:underline">Política de cookies</a>
          <a href="/pages/terminos-uso.html" className="text-yellow-400 hover:underline">Términos y condiciones</a>
        </div>

        {/* Marca de agua grande y clara */}
        <p className="text-2xl font-bold text-white">
          www.estanoche.es © Proebac25 Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}