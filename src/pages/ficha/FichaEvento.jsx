// src/pages/FichaEvento.jsx
import React from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const provincias = [
  '', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Baleares', 'Barcelona',
  'Bizkaia', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ceuta', 'Ciudad Real', 'Córdoba',
  'A Coruña', 'Cuenca', 'Gipuzkoa', 'Girona', 'Granada', 'Guadalajara', 'Huelva', 'Huesca', 'Jaén',
  'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Melilla', 'Murcia', 'Navarra', 'Ourense', 'Palencia',
  'Las Palmas', 'Pontevedra', 'La Rioja', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla',
  'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Zamora', 'Zaragoza'
];

export default function FichaEvento() {
  return (
    <>
      {/* Fondo animado */}
      <div 
        className="fixed inset-0 -z-10 bg-gradient-to-br from-en-blue-light via-en-blue-dark to-en-pink bg-[length:200%_200%]"
        style={{ animation: 'gradient 18s ease infinite' }}
      />

      <Header />

      {/* Contenido principal */}
      <main className="flex-1 pt-28 pb-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl">
            <h1 className="font-playfair text-4xl md:text-5xl text-center mb-8">
              Completa tu perfil
            </h1>
            <p className="text-green-400 text-xl text-center font-bold mb-12">
              ¡Móvil verificado! Rellena tus datos
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Columna izquierda */}
              <div className="space-y-6">
                <div>
                  <label className="block text-amber-400 font-bold text-lg mb-2">Nombre completo</label>
                  <input 
                    type="text" 
                    className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400 text-lg"
                    placeholder="Tu nombre" 
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold text-lg mb-2">Dirección (calle y número)</label>
                  <input 
                    type="text" 
                    className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400 text-lg"
                    placeholder="Calle y número" 
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold text-lg mb-2">Población / Ciudad</label>
                  <input 
                    type="text" 
                    className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400 text-lg"
                    placeholder="Ej. Jerez de la Frontera" 
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold text-lg mb-2">Código postal</label>
                  <input 
                    type="text" 
                    maxLength="5" 
                    className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400 text-lg"
                    placeholder="11540" 
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold text-lg mb-2">Provincia</label>
                  <select 
                    className="w-full p-4 rounded-2xl bg-white/10 border-none text-white text-lg appearance-none bg-no-repeat bg-right-4 bg-center bg-[length:12px]"
                    style={{backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'%3e%3cpath d=\'M7 10l5 5 5-5z\'/%3e%3c/svg%3e")'}}
                    defaultValue="Cádiz"
                  >
                    {provincias.map(provincia => (
                      <option key={provincia} value={provincia}>
                        {provincia || 'Selecciona provincia'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-6">
                <div>
                  <label className="block text-amber-400 font-bold text-lg mb-2">Instagram</label>
                  <input 
                    type="text" 
                    className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400 text-lg"
                    placeholder="@tuperfil" 
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold text-lg mb-2">Facebook</label>
                  <input 
                    type="text" 
                    className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400 text-lg"
                    placeholder="facebook.com/tuperfil" 
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold text-lg mb-2">TikTok</label>
                  <input 
                    type="text" 
                    className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400 text-lg"
                    placeholder="@tuperfil" 
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold text-lg mb-2">Web</label>
                  <input 
                    type="url" 
                    className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400 text-lg"
                    placeholder="https://tuweb.com" 
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-bold text-lg mb-2">Foto de perfil</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="w-full p-4 rounded-2xl bg-white/10 border-none text-white text-lg file:bg-gradient-to-r file:from-en-pink file:to-en-amber file:border-none file:px-6 file:py-3 file:rounded-full file:text-white file:font-bold file:cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-8">
              <label className="block text-amber-400 font-bold text-lg mb-2">Descripción / bio</label>
              <textarea 
                rows="6" 
                className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400 text-lg resize-vertical"
                placeholder="Ej. Amante del flamenco y las zambombas de Jerez"
              />
            </div>

            {/* Botón guardar */}
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-en-pink to-en-amber px-12 py-4 rounded-full text-xl font-bold text-white transition-all hover:scale-105">
                Guardar perfil
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </>
  );
}