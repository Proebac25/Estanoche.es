// src/pages/AltaUsuario.jsx
import React from 'react';
import Cerrado from '../../components/Cerrado.jsx';

export default function AltaUsuario() {
  const guardar = () => {
    if (!document.getElementById('nombre').value.trim()) {
      return alert('El nombre es obligatorio');
    }
    alert('¡Perfil guardado con éxito!');
    if (document.getElementById('publicar').value === 'si') {
      window.location.href = 'crear_local_o_grupo.html';
    } else {
      window.location.href = 'agenda.html';
    }
  };

  // Efecto para cargar parámetros URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('email')) {
      document.getElementById('email').value = params.get('email');
      document.getElementById('telefono').value = params.get('telefono') || '';
      document.getElementById('nombre').value = params.get('nombre') || '';
    }
  }, []);

  return (
    <Cerrado>
      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto bg-gray-900/95 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl relative pb-32">
        <h1 className="font-playfair text-4xl md:text-5xl text-center mb-8">Completa tu perfil</h1>
        <p className="text-green-500 font-bold mb-6 text-center">¡Móvil verificado! Rellena tus datos</p>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Nombre */}
          <div>
            <label className="block text-amber-400 text-lg font-semibold mb-2">Nombre completo *</label>
            <input 
              type="text" 
              id="nombre" 
              required 
              className="w-full p-4 rounded-2xl bg-white/10 border-none text-white text-lg placeholder-gray-400"
              placeholder="Tu nombre completo"
            />
          </div>

          {/* ... resto del formulario igual ... */}

          {/* Publicar eventos */}
          <div>
            <label className="block text-amber-400 text-lg font-semibold mb-2">¿Quieres publicar eventos?</label>
            <select 
              id="publicar"
              className="w-full p-4 rounded-2xl bg-white/10 border-none text-white text-lg appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M7 10l5 5 5-5z\"/></svg>')] bg-no-repeat bg-right-4 bg-center bg-[length:12px]"
            >
              <option value="no">No, solo quiero ver eventos</option>
              <option value="si">Sí, quiero crear locales y eventos</option>
            </select>
          </div>
        </div>

        {/* Footer interno */}
        <footer className="absolute bottom-0 left-0 right-0 p-6 bg-black/30 backdrop-blur-lg rounded-b-2xl">
          <div className="flex justify-between items-center mb-2">
            <a href="index.html" className="bg-gradient-to-r from-en-pink to-en-amber px-8 py-3 rounded-full text-white font-bold text-decoration-none transition-all hover:scale-105">
              Salir
            </a>
            <button 
              onClick={guardar}
              className="bg-gradient-to-r from-en-pink to-en-amber px-8 py-3 rounded-full text-white font-bold border-none cursor-pointer transition-all hover:scale-105"
            >
              Guardar
            </button>
          </div>
          <div className="text-center text-gray-400 text-sm">
            © 2025 Proebac · Todos los derechos reservados
          </div>
        </footer>
      </div>
    </Cerrado>
  );
}