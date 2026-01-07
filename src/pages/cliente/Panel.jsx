// D:\ene\src\pages\usuario\RegistroCliente.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaCamera, FaCalendarAlt, FaStar, FaChevronRight, FaPhoneAlt } from 'react-icons/fa';
import '../../styles/core/core-ui-v11.css';

const RegistroCliente = () => {
  const { theme } = useTheme();
  const { user, upgradeToPromoter } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState([]);
  const [eventosSeguidos, setEventosSeguidos] = useState([]); // Nuevo estado para eventos
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Verificar estado del usuario al cargar
  useEffect(() => {
    // 1. Verificar autenticación básica
    if (!user) {
      console.warn("⚠️ No hay usuario autenticado, redirigiendo a AltaUsuario");
      navigate('/AltaUsuario');
      return;
    }

    // 2. Si es promotor, permitir acceso pero loguear (ya no redirigimos forzosamente)
    if (user.tipo === 'promotor') {
      console.log("📍 Usuario promotor visualizando vista cliente");
    }

    // 3. Cargar datos iniciales vacíos
    setTimeout(() => {
      // Favoritos vacíos inicialmente (en prod se cargaría de DB)
      setFavoritos([]);
      setEventosSeguidos([]);
      setLoading(false);
    }, 500);
  }, [user, navigate, location]);

  // Navegar a agenda
  const irAAgenda = () => {
    navigate('/agenda');
  };

  // FUNCIÓN: Manejar el cambio a promotor
  const handleUpgradeToPromoter = async () => {
    if (!user.telefono) {
      // Si no tiene teléfono, lo mandamos a registrar móvil con la intención de ser promotor
      navigate('/RegistroMovil', { state: { upgrade: true } });
      return;
    }

    setIsUpgrading(true);
    const result = await upgradeToPromoter(user.id);
    setIsUpgrading(false);

    if (result.success) {
      console.log('🎉 Cuenta mejorada a promotor');
      navigate('/RegistroPromotor');
    } else {
      alert('Error al mejorar la cuenta: ' + result.error);
    }
  };

  // Helper para capitalizar
  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

  // Si está cargando
  if (loading) {
    return (
      <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col">
        <Header theme={theme} />
        <div className="flex-1 flex items-center justify-center text-mo-text dark:text-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mo-olive mx-auto mb-4"></div>
            <p className="text-mo-muted dark:text-gray-400">Cargando perfil...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            {/* Toggle PRO (Inactivo -> Link) */}
            {user.tipo === 'promotor' && (
              <button
                onClick={() => navigate('/RegistroPromotor')}
                className="text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
              >
                PRO
              </button>
            )}

            <span>{capitalize(user.nombre_usuario)}</span>

            {/* Toggle CLI (Activo) */}
            {user.tipo === 'promotor' && (
              <span className="text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold bg-mo-sage text-white shadow-inner">
                CLI
              </span>
            )}
          </div>
        </div>

        {/* Acciones de Cuenta (Ficha) */}
        <div className="w-full mb-2 flex justify-center">
          <button
            onClick={() => navigate('/FichaUsuario')}
            className="px-8 py-2 bg-mo-sage text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
          >
            Editar perfil
          </button>
        </div>

        {/* Sección: Próximos Eventos (Listado Simple) */}
        <div className="w-full mb-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="font-display text-sm font-semibold text-mo-text dark:text-gray-200 flex items-center gap-2">
              <FaCalendarAlt className="text-mo-olive" size={14} />
              Próximos Eventos
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-mo overflow-hidden">
            {eventosSeguidos.length === 0 ? (
              <div className="p-3 text-center text-xs text-mo-muted dark:text-gray-500 italic">
                No tienes eventos próximos
              </div>
            ) : (
              eventosSeguidos.map((ev, index) => (
                <Link key={ev.id} to={`/eventos/${ev.id}`} className={`flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${index !== eventosSeguidos.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                  <span className="text-mo-text dark:text-gray-300 font-medium truncate text-sm">{ev.nombre}</span>
                  <FaChevronRight size={10} className="text-mo-muted" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sección: Tus Favoritos (Listado Simple) */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="font-display text-sm font-semibold text-mo-text dark:text-gray-200 flex items-center gap-2">
              <FaStar className="text-mo-coral" size={14} />
              Tus Favoritos
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-mo overflow-hidden">
            {favoritos.length === 0 ? (
              <div className="p-3 text-center text-xs text-mo-muted dark:text-gray-500 italic">
                Aún no has marcado favoritos
              </div>
            ) : (
              favoritos.map((fav, index) => (
                <Link key={fav.id} to={`/entidades/${fav.id}`} className={`flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group ${index !== favoritos.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                  <span className="text-mo-text dark:text-gray-300 font-medium text-sm group-hover:text-mo-olive transition-colors">{fav.nombre}</span>
                  <FaChevronRight size={10} className="text-mo-muted" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Botón de Agenda (Principal) */}
        <div className="w-full mt-auto pb-6 text-center">
          <button
            onClick={irAAgenda}
            className="w-full py-5 text-white rounded-3xl font-display text-2xl font-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] mb-4"
            style={{
              background: 'linear-gradient(135deg, var(--mo-spot), var(--mo-amber))',
              boxShadow: '0 12px 40px rgba(247, 37, 133, 0.25)',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Vamos a la AGENDA
          </button>

          <div className="mt-2">
            <button
              onClick={() => navigate('/ConfirmarTelefono', { state: { upgrade: true } })}
              disabled={isUpgrading}
              className={`text-mo-coral font-bold text-sm hover:underline ${isUpgrading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUpgrading ? 'Mejorando cuenta...' : '¿Eres promotor?'}
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default RegistroCliente;