// src/pages/IniciarSesion.jsx
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://grehdbulpfgtphrvemup.supabase.co',     // ← TU URL
  'sb_publishable_NY3z8RN2s1lH3d4qV6JsMg_cPuTnehx'                          // ← TU ANON KEY
);

export default function IniciarSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const login = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMensaje('Error: ' + error.message);
    } else {
      setMensaje('¡Login correcto! Redirigiendo...');
      setTimeout(() => window.location.href = '/agenda', 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1e1e1e] flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-md w-full border border-white/20">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Iniciar sesión</h1>
        
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-white/10 border border-white/30 rounded-xl px-6 py-4 text-white mb-4"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full bg-white/10 border border-white/30 rounded-xl px-6 py-4 text-white mb-6"
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-2xl py-5 rounded-full hover:scale-105 transition"
        >
          {loading ? 'Entrando...' : 'LOGIN'}
        </button>

        {mensaje && <p className="text-center mt-6 text-xl">{mensaje}</p>}
      </div>
    </div>
  );
}