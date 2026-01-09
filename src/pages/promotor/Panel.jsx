import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaCamera, FaCalendarAlt, FaChartBar, FaChevronRight } from 'react-icons/fa';
import '../../styles/core/core-ui-v11.css';

const RegistroPromotor = () => {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState('');
  const [validando, setValidando] = useState(false);
  const [error, setError] = useState('');
  const [mostrarValidacion, setMostrarValidacion] = useState(false);
  const [eventosCreados, setEventosCreados] = useState([]);

  // Verificar estado del usuario al cargar
  useEffect(() => {
    if (!user) {
      navigate('/AltaUsuario');
      return;
    }

    // Si es cliente, redirigir a ficha cliente
    // if (user.tipo === 'cliente') {
    //   console.warn('⚠️ PanelPromotor: El usuario es tipo CLIENTE. Debería redirigir, pero lo pausamos para debug.');
    //   // navigate('/RegistroCliente');
    //   // return;
    // }

    // Si es promotor_pendiente, mostrar validaciÃ³n
    if (user.tipo === 'promotor_pendiente') {
      setMostrarValidacion(true);
    }

    // Cargar datos falsos iniciales
    setEventosCreados([]);

  }, [user, navigate]);

  if (!user) {
    return <div className="min-h-screen bg-mo-bg dark:bg-gray-900" />;
  }

  // Validar cÃ³digo de promotor
  const handleValidarCodigo = async (e) => {
    e.preventDefault();
    setError('');
    setValidando(true);

    // Generar cÃ³digo del dÃ­a en formato AAMMDD
    const hoy = new Date();
    const codigoHoy = hoy.getFullYear().toString().slice(-2) +
      ('0' + (hoy.getMonth() + 1)).slice(-2) +
      ('0' + hoy.getDate()).slice(-2);

    // SimulaciÃ³n de validaciÃ³n (en producciÃ³n serÃ­a llamada API)
    setTimeout(() => {
      setValidando(false);

      if (codigo.trim() === codigoHoy) {
        const updatedUser = {
          ...user,
          tipo: 'promotor',
          estado_profesional: 'activo'
        };

        if (updateUser) {
          updateUser(updatedUser);
        }

        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      } else {
        setError(`CÃ³digo incorrecto. El cÃ³digo para hoy (${hoy.toLocaleDateString('es-ES')}) es: ${codigoHoy}`);
      }
    }, 1000);
  };

  const handleSerCliente = () => {
    const updatedUser = {
      ...user,
      tipo: 'cliente'
    };

    if (updateUser) {
      updateUser(updatedUser);
    }

    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    navigate('/RegistroCliente');
    window.location.reload();
  };

  // Si estÃ¡ pendiente de validar, mostrar pantalla de validaciÃ³n antigua (pero estilizada mÃ­nimamente si se desea, por ahora mantenemos estructura bÃ¡sica funcional o la adaptamos)
  // Para mantener simplicidad y foco en el dashboard, si es 'promotor_pendiente' mostramos la UI de validaciÃ³n.
  if (mostrarValidacion) {
    return (
      <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
        <Header theme={theme} />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white mb-4">Validar Cuenta de Promotor</h1>
          <p className="text-mo-muted dark:text-gray-400 mb-6 max-w-md">
            Introduce el cÃ³digo de invitaciÃ³n diario para activar tu perfil profesional.
          </p>

          <form onSubmit={handleValidarCodigo} className="w-full max-w-xs space-y-4">
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="CÃ³digo de hoy"
              className="w-full p-3 text-center text-xl tracking-widest bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-mo-sage transition-colors text-mo-text dark:text-white"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={validando}
              className="w-full py-3 bg-mo-olive text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {validando ? 'Validando...' : 'Activar Cuenta'}
            </button>
          </form>

          <button onClick={handleSerCliente} className="mutate-link mt-8 text-sm text-mo-muted hover:text-mo-olive underline">
            Prefiero continuar como cliente normal
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // Helper para capitalizar
  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

  // DASHBOARD PROMOTOR ACTIVO
  return (
    <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Header theme={theme} />

      <main className="flex-1 flex flex-col items-center p-4 pt-0 md:p-8 w-full max-w-2xl mx-auto">

        {/* Identidad Visual Centrada + Toggle */}
        <div className="flex flex-col items-center mb-2 w-full -mt-12 z-10">
          <div className="relative group mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-mo-muted dark:text-gray-500 border-4 border-mo-surface dark:border-gray-800 shadow-soft overflow-hidden">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.nombre_usuario} className="w-full h-full object-cover" />
              ) : (
                <FaCamera size={32} />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 font-display text-2xl font-bold text-mo-text dark:text-gray-100">
            {/* Toggle PRO (Activo) */}
            <span className="text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold bg-mo-olive text-white shadow-inner">
              PRO
            </span>

            <span className="capitalize">{user.nombre_usuario}</span>

            {/* Toggle CLI (Inactivo -> Link) */}
            <button
              onClick={() => navigate('/RegistroCliente')}
              className="text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
            >
              CLI
            </button>
          </div>
        </div>

        {/* Acciones de Cuenta */}
        <div className="w-full mb-2 flex justify-center">
          <button
            onClick={() => navigate('/FichaPromotor')}
            className="px-8 py-2 bg-mo-sage text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
          >
            Editar perfil
          </button>
        </div>

        {/* SecciÃ³n: Mis Locales (NUEVO - ACTIVOS PRINCIPALES) */}
        <div className="w-full mb-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="font-display text-sm font-semibold text-mo-text dark:text-gray-200 flex items-center gap-2">
              <FaChartBar className="text-mo-olive" size={14} />
              Mis Locales
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-mo overflow-hidden">
            {/* Placeholder vacÃ­o por ahora */}
            <div className="p-3 text-center text-xs text-mo-muted dark:text-gray-500 italic">
              No tienes locales activos
            </div>

            {/* BotÃ³n para crear local */}
            <div className="border-t border-gray-100 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50 text-center">
              <button className="text-xs font-bold text-mo-sage hover:text-mo-olive transition-colors uppercase tracking-wider">
                + Crear Nuevo Local
              </button>
            </div>
          </div>
        </div>

        {/* SecciÃ³n: Mis Eventos (GestiÃ³n) */}
        <div className="w-full mb-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="font-display text-sm font-semibold text-mo-text dark:text-gray-200 flex items-center gap-2">
              <FaCalendarAlt className="text-mo-olive" size={14} />
              Mis Eventos
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-mo overflow-hidden">
            {eventosCreados.length === 0 ? (
              <div className="p-3 text-center text-xs text-mo-muted dark:text-gray-500 italic">
                No tienes eventos activos
              </div>
            ) : (
              eventosCreados.map((ev, index) => (
                <div key={ev.id} className={`flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${index !== eventosCreados.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                  <span className="text-mo-text dark:text-gray-300 font-medium truncate text-sm">{ev.nombre}</span>
                  <FaChevronRight size={10} className="text-mo-muted" />
                </div>
              ))
            )}

            {/* BotÃ³n para crear evento */}
            <div className="border-t border-gray-100 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50 text-center">
              <button className="text-xs font-bold text-mo-sage hover:text-mo-olive transition-colors uppercase tracking-wider">
                + Crear Nuevo Evento
              </button>
            </div>
          </div>
        </div>


        {/* Footer actions */}
        <div className="w-full mt-auto pb-6 text-center">
          <button
            onClick={() => navigate('/agenda')}
            className="text-mo-muted text-xs hover:underline"
          >
            Volver a la Agenda pÃºblica
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default RegistroPromotor;
