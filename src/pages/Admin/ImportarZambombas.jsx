// src/pages/Admin/ImportarZambombas.jsx
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://grehdbulpfgtphrvemup.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_ANON_KEY) {
  console.warn('VITE_SUPABASE_ANON_KEY no definida en .env.local');
}

// debug safe preview
console.log('VITE_SUPABASE_ANON_KEY (preview):', (SUPABASE_ANON_KEY || '').slice(0,8) + '...');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true },
});

export default function ImportarZambombas() {
  const [archivo, setArchivo] = useState(null);
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  useEffect(() => {
    // leer la sesión al montar
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setUser(sessionData?.session?.user ?? null);
    })();

    // subscribe a cambios de auth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const convertirFecha = (fechaStr) => {
    if (!fechaStr) return null;
    try {
      const [day, month, year] = fechaStr.split('/');
      if (!day || !month || !year) return null;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (error) {
      console.error('Error convirtiendo fecha:', fechaStr, error);
      return null;
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivo(file);
    setMensaje(`Archivo cargado: ${file.name}`);

    Papa.parse(file, {
      header: false,
      delimiter: ';',
      skipEmptyLines: true,
      complete: (result) => {
        console.log('📊 Datos parseados (preview):', result.data.slice(0, 3));
        const datosMapeados = result.data.map((row) => ({
          tipo_evento: row[0] || '',
          fecha: row[1] || '',
          organizador: row[2] || '',
          direccion: row[3] || '',
          poblacion: row[4] || '',
          protagonista: row[5] || '',
          hora_inicio: row[6] || '',
          fecha_fin_csv: row[7] || '',
          hora_fin_csv: row[8] || '',
          fuente: row[9] || '',
        }));
        setDatos(datosMapeados);
        setMensaje(`✅ ${datosMapeados.length} zambombas listas`);
      },
      error: (error) => {
        console.error('Error parseando CSV:', error);
        setMensaje('❌ Error leyendo el CSV');
      }
    });
  };

  const importar = async () => {
    if (datos.length === 0) {
      setMensaje('❌ No hay datos');
      return;
    }

    setCargando(true);
    setMensaje('⏳ Importando...');

    try {
      // Comprobación de sesión in-situ
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error obteniendo sesión:', sessionError);
        setMensaje('❌ Error comprobando sesión');
        setCargando(false);
        return;
      }
      const session = sessionData?.session ?? null;
      if (!session) {
        setMensaje('❌ Debes iniciar sesión para importar zambombas');
        setCargando(false);
        return;
      }

      // Mapear filas válidas
      const zambombas = datos.map((row) => {
        const fechaEvento = convertirFecha(row.fecha);
        if (!fechaEvento || !row.hora_inicio) return null;
        return {
          titulo: `Zambomba: ${row.organizador}`.substring(0, 200),
          descripcion: `Artistas: ${row.protagonista}. ${row.direccion ? `Lugar: ${row.direccion}.` : ''}`.substring(0, 500),
          fecha_evento: fechaEvento,
          hora_evento: row.hora_inicio,
          lugar: row.organizador || 'Lugar por confirmar',
          direccion: row.direccion || '',
          artistas: row.protagonista || '',
          fuente: row.fuente || 'Prensa',
          created_at: new Date().toISOString()
        };
      }).filter(e => e !== null);

      console.log('🎯 Zambombas a importar:', zambombas.length);

      if (zambombas.length === 0) {
        setMensaje('❌ No hay zambombas válidas');
        setCargando(false);
        return;
      }

      const { error } = await supabase.from('zambombas_2025').insert(zambombas);

      setCargando(false);

      if (error) {
        console.error('❌ Error:', error);
        setMensaje(`❌ Error: ${error.message || JSON.stringify(error)}`);
      } else {
        setMensaje(`✅ ¡ÉXITO! ${zambombas.length} zambombas importadas`);
        setDatos([]);
      }

    } catch (error) {
      setCargando(false);
      console.error('💥 Error:', error);
      setMensaje(`❌ Error: ${error.message || String(error)}`);
    }
  };

  // Auth: signup / login / logout
  const handleSignup = async () => {
    setCargando(true);
    setMensaje('⏳ Creando cuenta...');
    try {
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword
      });
      setCargando(false);
      if (error) {
        console.error('SignUp error', error);
        setMensaje(`❌ SignUp: ${error.message}`);
        return;
      }
      setMensaje('✅ Cuenta creada. Revisa tu email para confirmar si tu proyecto lo requiere.');
    } catch (err) {
      setCargando(false);
      console.error(err);
      setMensaje('❌ Error en registro');
    }
  };

  const handleLogin = async () => {
    setCargando(true);
    setMensaje('⏳ Iniciando sesión...');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });
      setCargando(false);
      if (error) {
        console.error('SignIn error', error);
        setMensaje(`❌ SignIn: ${error.message}`);
        return;
      }
      setMensaje('✅ Sesión iniciada');
      setUser(data?.user ?? null);
    } catch (err) {
      setCargando(false);
      console.error(err);
      setMensaje('❌ Error iniciando sesión');
    }
  };

  const handleLogout = async () => {
    setCargando(true);
    setMensaje('⏳ Cerrando sesión...');
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCargando(false);
      setMensaje('✅ Sesión cerrada');
    } catch (err) {
      setCargando(false);
      console.error(err);
      setMensaje('❌ Error cerrando sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1e1e1e] text-white p-8">
      <div className="max-w-4xl mx-auto bg-white/5 rounded-3xl p-8 border border-white/10">

        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold">Importar Zambombas 2025</h1>
          <div>
            {user ? (
              <div className="text-right">
                <div className="text-sm text-gray-300">Conectado: {user.email}</div>
                <button onClick={handleLogout} className="mt-2 px-3 py-2 bg-gray-700 rounded">Cerrar sesión</button>
              </div>
            ) : (
              <div className="text-right">
                <div className="text-sm text-gray-300">No conectado</div>
              </div>
            )}
          </div>
        </header>

        {!user && (
          <section className="mb-6 p-4 bg-white/3 rounded">
            <div className="flex gap-4 mb-4">
              <button onClick={() => setAuthMode('login')} className={`px-4 py-2 rounded ${authMode === 'login' ? 'bg-pink-600' : 'bg-gray-600'}`}>Login</button>
              <button onClick={() => setAuthMode('signup')} className={`px-4 py-2 rounded ${authMode === 'signup' ? 'bg-pink-600' : 'bg-gray-600'}`}>Registro</button>
            </div>

            <div className="grid grid-cols-1 gap-3 max-w-md">
              <input type="email" placeholder="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="p-2 rounded text-black" />
              <input type="password" placeholder="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="p-2 rounded text-black" />
              {authMode === 'signup' ? (
                <button onClick={handleSignup} disabled={cargando} className="py-2 px-4 bg-amber-500 rounded font-bold">Crear cuenta</button>
              ) : (
                <button onClick={handleLogin} disabled={cargando} className="py-2 px-4 bg-amber-500 rounded font-bold">Iniciar sesión</button>
              )}
            </div>
          </section>
        )}

        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-6">
          <p className="text-yellow-300 text-center">
            📋 <strong>NUEVA TABLA:</strong> Se importará en <code>zambombas_2025</code>
          </p>
        </div>

        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="block w-full text-2xl file:mr-8 file:py-6 file:px-12 file:rounded-full file:bg-gradient-to-r file:from-pink-600 file:to-amber-500 file:text-white file:font-bold mb-6"
        />

        {mensaje && (
          <p className={`text-lg text-center mb-6 ${
            mensaje.includes('✅') ? 'text-green-400' :
            mensaje.includes('❌') ? 'text-red-400' :
            'text-yellow-400'
          }`}>
            {mensaje}
          </p>
        )}

        {datos.length > 0 && user && (
          <div className="text-center">
            <p className="text-xl mb-4">
              📊 {datos.length} zambombas listas
            </p>
            <button
              onClick={importar}
              disabled={cargando}
              className="w-full bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-2xl py-4 rounded-full hover:scale-105 transition disabled:opacity-50"
            >
              {cargando ? '⏳ Importando...' : '🚀 IMPORTAR ZAMBOMBAS'}
            </button>
          </div>
        )}

        {datos.length > 0 && !user && (
          <div className="text-center">
            <p className="text-lg mb-4 text-yellow-300">Debes iniciar sesión para importar. Usa el formulario de arriba.</p>
          </div>
        )}

      </div>
    </div>
  );
}
