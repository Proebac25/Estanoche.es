// src/pages/Admin/ImportarZambombas.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://grehdbulpfgtphrvemup.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZWhkYnVscGZndHBocnZlbXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTQ2NDQsImV4cCI6MjA3ODAzMDY0NH0.q4VMCZultWQh3zSZktDYhfWoYk3sgrRyZahRwqFY3Yc'
);

export default function ImportarZambombas() {
  const [archivo, setArchivo] = useState(null);
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const convertirFecha = (fechaStr) => {
    if (!fechaStr) return null;
    try {
      const [day, month, year] = fechaStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (error) {
      console.error('Error convirtiendo fecha:', fechaStr);
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
        console.log('📊 Datos parseados:', result.data.slice(0, 3));
        
        const datosMapeados = result.data.map(row => ({
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
          fuente: row.fuente || 'Prensa'
        };
      }).filter(e => e !== null);

      console.log('🎯 Zambombas a importar:', zambombas.length);

      if (zambombas.length === 0) {
        setMensaje('❌ No hay zambombas válidas');
        setCargando(false);
        return;
      }

      const { error } = await supabase
        .from('zambombas_2025')
        .insert(zambombas);

      setCargando(false);
      
      if (error) {
        console.error('❌ Error:', error);
        setMensaje(`❌ Error: ${error.message}`);
      } else {
        setMensaje(`✅ ¡ÉXITO! ${zambombas.length} zambombas importadas`);
        setDatos([]);
      }

    } catch (error) {
      setCargando(false);
      console.error('💥 Error:', error);
      setMensaje(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1e1e1e] text-white p-8">
      <div className="max-w-4xl mx-auto bg-white/5 rounded-3xl p-12 border border-white/10">
        <h1 className="text-5xl font-bold text-center mb-12">Importar Zambombas 2025</h1>

        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-6">
          <p className="text-yellow-300 text-center">
            📋 <strong>NUEVA TABLA:</strong> Se importará en <code>zambombas_2025</code>
          </p>
        </div>

        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFile}
          className="block w-full text-2xl file:mr-8 file:py-6 file:px-12 file:rounded-full file:bg-gradient-to-r file:from-pink-600 file:to-amber-500 file:text-white file:font-bold mb-10"
        />

        {mensaje && (
          <p className={`text-2xl text-center mb-8 ${
            mensaje.includes('✅') ? 'text-green-400' : 
            mensaje.includes('❌') ? 'text-red-400' : 
            'text-yellow-400'
          }`}>
            {mensaje}
          </p>
        )}

        {datos.length > 0 && (
          <div className="text-center">
            <p className="text-xl mb-4">
              📊 {datos.length} zambombas listas
            </p>
            <button
              onClick={importar}
              disabled={cargando}
              className="w-full bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-3xl py-8 rounded-full hover:scale-105 transition disabled:opacity-50"
            >
              {cargando ? '⏳ Importando...' : '🚀 IMPORTAR ZAMBOMBAS'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}