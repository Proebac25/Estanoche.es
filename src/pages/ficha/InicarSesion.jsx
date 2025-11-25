// src/pages/FichaUsuario.jsx
import React, { useState, useEffect } from 'react';

export default function FichaUsuario() {
  const [mostrarNegocio, setMostrarNegocio] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);

  useEffect(() => {
    // Rellenar datos del registro
    const params = new URLSearchParams(window.location.search);
    if (params.has('email')) {
      document.getElementById('email').value = params.get('email');
      document.getElementById('phone').value = params.get('telefono') || '';
      document.getElementById('full_name').value = params.get('nombre') || '';
      document.getElementById('location_city').value = params.get('ciudad') || '';
    }
  }, []);

  const handleAccountTypeChange = (e) => {
    const value = e.target.value;
    setMostrarNegocio(value === 'creador' || value === 'negocio');
  };

  const handleGuardar = () => {
    if (!check1 || !check2) {
      alert('⚠️ Debes descargar y marcar ambos documentos para continuar');
      return;
    }

    alert('¡Perfil guardado con éxito!\nBienvenido a EstaNoche.es');
    // window.location.href = '/dashboard.html';
  };

  const handleDescarga = (setCheckFunction) => {
    setCheckFunction(true);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4">
      <div className="max-w-2xl mx-auto bg-gray-900/95 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl text-center">
        <h1 className="font-playfair text-4xl md:text-5xl mb-6">Mi perfil completo</h1>
        <p className="text-green-500 font-bold mb-8">¡Código verificado! Completa tu perfil</p>

        {/* Formulario completo */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-left">
            <label className="block text-amber-400 text-lg font-semibold mb-2">Nombre completo *</label>
            <input 
              type="text" 
              id="full_name" 
              placeholder="Juan Pérez García" 
              required
              className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400"
            />
          </div>

          <div className="text-left">
            <label className="block text-amber-400 text-lg font-semibold mb-2">Email (usuario) *</label>
            <input 
              type="email" 
              id="email" 
              disabled
              className="w-full p-4 rounded-2xl bg-white/10 border-none text-white opacity-70"
            />
          </div>

          <div className="text-left">
            <label className="block text-amber-400 text-lg font-semibold mb-2">Teléfono móvil *</label>
            <input 
              type="tel" 
              id="phone" 
              disabled
              className="w-full p-4 rounded-2xl bg-white/10 border-none text-white opacity-70"
            />
          </div>

          <div className="text-left">
            <label className="block text-amber-400 text-lg font-semibold mb-2">Ciudad *</label>
            <input 
              type="text" 
              id="location_city" 
              placeholder="Jerez de la Frontera"
              className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400"
            />
          </div>

          <div className="text-left">
            <label className="block text-amber-400 text-lg font-semibold mb-2">Código postal</label>
            <input 
              type="text" 
              id="postal_code" 
              placeholder="11402"
              className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400"
            />
          </div>

          <div className="text-left">
            <label className="block text-amber-400 text-lg font-semibold mb-2">Tipo de cuenta</label>
            <select 
              id="account_type"
              onChange={handleAccountTypeChange}
              className="w-full p-4 rounded-2xl bg-white/10 border-none text-white appearance-none bg-no-repeat bg-right-4 bg-center bg-[length:12px]"
              style={{backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'%3e%3cpath d=\'M7 10l5 5 5-5z\'/%3e%3c/svg%3e")'}}
            >
              <option value="usuario">Usuario normal</option>
              <option value="creador">Creador / Profesional</option>
              <option value="negocio">Negocio / Local</option>
            </select>
          </div>

          {/* Sección negocio (condicional) */}
          {mostrarNegocio && (
            <div className="space-y-4 border-t border-white/20 pt-4">
              <div className="text-left">
                <label className="block text-amber-400 text-lg font-semibold mb-2">Nombre del negocio</label>
                <input 
                  type="text" 
                  id="business_name"
                  className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400"
                />
              </div>
              <div className="text-left">
                <label className="block text-amber-400 text-lg font-semibold mb-2">CIF / NIF</label>
                <input 
                  type="text" 
                  id="cif"
                  className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400"
                />
              </div>
              <div className="text-left">
                <label className="block text-amber-400 text-lg font-semibold mb-2">Descripción corta</label>
                <textarea 
                  rows="3" 
                  id="bio_description"
                  className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400 resize-vertical"
                />
              </div>
            </div>
          )}

          <div className="text-left">
            <label className="block text-amber-400 text-lg font-semibold mb-2">Instagram (opcional)</label>
            <input 
              type="text" 
              id="instagram" 
              placeholder="@estanoche_jerez"
              className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400"
            />
          </div>

          <div className="text-left">
            <label className="block text-amber-400 text-lg font-semibold mb-2">Web (opcional)</label>
            <input 
              type="url" 
              id="website_url"
              className="w-full p-4 rounded-2xl bg-white/10 border-none text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* LOPD con descarga directa */}
        <div className="mt-8 text-gray-300">
          <p className="font-bold mb-4">Descarga y lee los documentos antes de aceptar</p>
          
          <label className="flex items-center justify-center gap-3 my-3 text-white text-lg">
            <input 
              type="checkbox" 
              checked={check1}
              onChange={(e) => setCheck1(e.target.checked)}
              className="w-5 h-5 accent-amber-400"
            />
            He descargado y leído la 
            <a 
              href="legal/Política_de_Privacidad_EstaNoche.pdf" 
              download 
              onClick={() => handleDescarga(setCheck1)}
              className="text-amber-400 underline"
            >
              Política de Privacidad
            </a>
          </label>
          
          <label className="flex items-center justify-center gap-3 my-3 text-white text-lg">
            <input 
              type="checkbox" 
              checked={check2}
              onChange={(e) => setCheck2(e.target.checked)}
              className="w-5 h-5 accent-amber-400"
            />
            He descargado y leído los 
            <a 
              href="legal/Términos_y_Condiciones_EstaNoche.pdf" 
              download 
              onClick={() => handleDescarga(setCheck2)}
              className="text-amber-400 underline"
            >
              Términos y Condiciones
            </a>
          </label>
        </div>

        <div className="flex gap-6 justify-center mt-8">
          <a 
            href="index.html" 
            className="bg-gradient-to-r from-en-pink to-en-amber px-8 py-4 rounded-full text-white font-bold no-underline transition-all hover:scale-105"
          >
            Volver
          </a>
          <button 
            onClick={handleGuardar}
            className="bg-gradient-to-r from-en-pink to-en-amber w-full max-w-xs py-4 rounded-full text-white font-bold border-none cursor-pointer transition-all hover:scale-105"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}