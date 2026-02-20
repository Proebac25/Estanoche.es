import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaArrowLeft, FaEdit, FaTrash, FaStore, FaMusic, FaTheaterMasks, FaPlus, FaInstagram, FaGlobe, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { FaFacebook, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';
import '../../styles/core/core-ui-v11.css';

const EntidadDetalle = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [entidad, setEntidad] = useState(null);
    const [eventos, setEventos] = useState([]);
    const [redes, setRedes] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!user) {
            navigate('/RegistroPromotor');
            return;
        }
        cargarEntidad();
        cargarEventos();
        cargarRedes();
        cargarGaleria();
        checkPermissions();
    }, [user, id]);

    const cargarEntidad = async () => {
        try {
            const { data, error } = await supabase
                .from('entidades')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setEntidad(data);
        } catch (error) {
            console.error('Error cargando entidad:', error);
            setMessage({ type: 'error', text: 'Error al cargar la entidad' });
        } finally {
            setLoading(false);
        }
    };

    const cargarRedes = async () => {
        try {
            const { data, error } = await supabase
                .from('redes_sociales')
                .select('*')
                .eq('propietario_id', id)
                .eq('tipo_propietario', 'entidad');

            if (error) throw error;
            setRedes(data || []);
        } catch (error) {
            console.error('Error cargando redes:', error);
        }
    };

    const cargarGaleria = async () => {
        try {
            const { data, error } = await supabase
                .from('imagenes_entidad')
                .select('*')
                .eq('entidad_id', id)
                .order('is_main', { ascending: false }) // Principales primero si hubiese
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGallery(data || []);
        } catch (error) {
            console.error('Error cargando galería:', error);
        }
    };

    const checkPermissions = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('relaciones_entidades')
                .select('rol')
                .eq('entidad_id', id)
                .eq('usuario_id', user.id)
                .single();

            if (data && (data.rol === 'propietario' || data.rol === 'admin')) {
                setIsOwner(true);
            }
        } catch (error) {
            // No relation found
        }
    };

    const cargarEventos = async () => {
        try {
            const { data, error } = await supabase
                .from('eventos')
                .select('*')
                .eq('entidad_id', id)
                .order('fecha_hora_inicio', { ascending: false })
                .limit(10);

            if (error) throw error;
            setEventos(data || []);
        } catch (error) {
            console.error('Error cargando eventos:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`¿Seguro que quieres eliminar "${entidad.nombre}"? Se eliminarán también todos sus eventos. Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('entidades')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Entidad eliminada correctamente' });
            setTimeout(() => navigate('/entidades'), 1500);
        } catch (error) {
            console.error('Error eliminando:', error);
            setMessage({ type: 'error', text: 'Error al eliminar la entidad' });
        }
    };

    const getEntidadIcon = (tipo) => {
        switch (tipo) {
            case 'local': return <FaStore />;
            case 'actividad': return <FaTheaterMasks />;
            case 'amenizador': return <FaMusic />;
            default: return <FaStore />;
        }
    };

    const getTipoLabel = (tipo) => {
        switch (tipo) {
            case 'local': return 'Local Físico';
            case 'actividad': return 'Actividad Social';
            case 'amenizador': return 'Artista / DJ';
            default: return tipo;
        }
    };

    const getSocialIcon = (tipo) => {
        switch (tipo) {
            case 'instagram': return <FaInstagram size={24} />;
            case 'facebook': return <FaFacebook size={24} />;
            case 'tiktok': return <FaTiktok size={24} />;
            case 'twitter': return <FaTwitter size={24} />;
            case 'youtube': return <FaYoutube size={24} />;
            default: return <FaGlobe size={24} />;
        }
    };

    const getSocialColorClass = (tipo) => {
        switch (tipo) {
            case 'instagram': return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white border-none';
            case 'facebook': return 'bg-[#1877F2] text-white border-none';
            case 'tiktok': return 'bg-black text-white border-none';
            case 'twitter': return 'bg-[#1DA1F2] text-white border-none';
            case 'youtube': return 'bg-[#FF0000] text-white border-none';
            default: return 'bg-white dark:bg-gray-700 text-mo-olive border border-gray-100 dark:border-gray-600';
        }
    };

    const handleBack = () => {
        // Si hay historial, vuelve atrás. Si no, va al panel del promotor (usuario)
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/panel-promotor'); // O la ruta que corresponda al perfil del usuario
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col">
                <Header theme={theme} />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="w-12 h-12 bg-mo-sage/20 rounded-full"></div>
                        <div className="text-mo-muted dark:text-gray-400 font-display font-bold">Cargando experiencia...</div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!entidad) {
        return (
            <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col">
                <Header theme={theme} />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-mo shadow-xl border border-gray-100 dark:border-gray-700 max-w-sm w-full">
                        <div className="text-4xl mb-4">🏮</div>
                        <h2 className="font-display text-xl font-bold text-mo-text dark:text-white mb-2">Entidad no encontrada</h2>
                        <p className="text-mo-muted dark:text-gray-400 mb-6">Parece que el enlace no es válido o la entidad ha sido eliminada.</p>
                        <button onClick={() => navigate('/entidades')} className="w-full py-3 bg-mo-sage text-white rounded-mo font-bold shadow-mo-soft transition-all active:scale-95">
                            Volver a mis entidades
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-4xl mx-auto md:p-6">

                {/* BOTÓN VOLVER (Mobile Floating / Desktop Top) */}
                <div className="absolute md:relative top-20 left-4 md:top-0 md:left-0 z-40">
                    <button
                        onClick={() => navigate('/entidades')}
                        className="flex items-center justify-center w-10 h-10 md:w-auto md:px-4 md:py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm md:bg-white dark:md:bg-gray-800 text-mo-muted hover:text-mo-sage rounded-full md:rounded-mo shadow-lg border border-gray-100 dark:border-gray-700 transition-all font-bold group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:block ml-2 text-xs uppercase tracking-widest">Mis Entidades</span>
                    </button>
                </div>

                {/* FICHA PREMIUM */}
                <div className="bg-white dark:bg-gray-800 md:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-12 mt-4 md:mt-2">

                    {/* BANNER HD */}
                    <div className="relative h-56 md:h-72 bg-gradient-to-br from-mo-sage/20 to-mo-olive/40 overflow-hidden">
                        {entidad.banner_url ? (
                            <img src={entidad.banner_url} alt="Banner" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-10 blur-sm">
                                <div className="text-9xl">{getEntidadIcon(entidad.tipo_entidad)}</div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                        {/* Acciones flotantes (Desktop) */}
                        {isOwner && (
                            <div className="absolute top-6 right-6 hidden md:flex gap-3">
                                <button
                                    onClick={() => navigate(`/entidad/${id}/editar`)}
                                    className="px-6 py-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white border border-white/30 rounded-full font-bold transition-all flex items-center gap-2 active:scale-95"
                                >
                                    <FaEdit size={14} />
                                    Editar Perfil
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-3 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md text-white border border-white/20 rounded-full transition-all active:scale-95"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* PERFIL INFO */}
                    <div className="relative px-6 pb-10 pt-16 md:pt-20 md:px-12">

                        {/* LOGO SUPERPUESTO */}
                        <div className="absolute -top-16 left-6 md:-top-20 md:left-12">
                            <div className="w-44 h-32 md:w-56 md:h-40 rounded-3xl bg-white dark:bg-gray-800 p-2 shadow-2xl border-4 border-white dark:border-gray-800">
                                <div className="w-full h-full rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden p-2">
                                    {entidad.avatar_url ? (
                                        <img src={entidad.avatar_url} alt={entidad.nombre} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-mo-sage text-6xl opacity-50">
                                            {getEntidadIcon(entidad.tipo_entidad)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center flex-wrap gap-3">
                                    <h1 className="font-display text-4xl md:text-5xl font-black text-mo-text dark:text-white leading-tight">
                                        {entidad.nombre}
                                    </h1>
                                    <span className="text-[10px] px-3 py-1 bg-mo-sage/10 text-mo-sage rounded-full font-bold uppercase tracking-[.3em] border border-mo-sage/20 shadow-inner">
                                        {getTipoLabel(entidad.tipo_entidad)}
                                    </span>
                                </div>

                                {entidad.calle && (
                                    <div className="flex items-start gap-2 text-lg text-mo-muted dark:text-gray-400 font-ui">
                                        <span className="text-mo-olive mt-1">📍</span>
                                        <div className="flex flex-col">
                                            <span>
                                                {entidad.calle} {entidad.numero && `, ${entidad.numero}`}
                                            </span>
                                            <span className="text-sm opacity-80">
                                                {entidad.codigo_postal} {entidad.ciudad && `- ${entidad.ciudad}`} {entidad.provincia && `(${entidad.provincia})`}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PRESENCIA DIGITAL */}
                            <div className="flex gap-4 flex-wrap">
                                {redes.map((red) => (
                                    <a
                                        key={red.id}
                                        href={red.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl hover:scale-110 transition-transform active:scale-95 ${getSocialColorClass(red.tipo_red)}`}
                                        title={red.tipo_red}
                                    >
                                        {getSocialIcon(red.tipo_red)}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* CARRUSEL DE IMÁGENES (GALERÍA) */}
                        {gallery.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xs uppercase tracking-widest font-black text-mo-muted mb-3">Galería</h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
                                    {gallery.map((img) => (
                                        <div key={img.id} className="snap-center shrink-0 w-64 h-40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <img src={img.url} alt="Galería" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* DESCRIPCIÓN (Estilo High-End) */}
                        {entidad.descripcion && (
                            <div className="mt-10 relative group">
                                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-mo-sage to-mo-olive rounded-full opacity-30 group-hover:opacity-100 transition-opacity"></div>
                                <p className="text-xl text-mo-muted dark:text-gray-300 leading-relaxed italic font-ui max-w-2xl">
                                    "{entidad.descripcion}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* SECCIÓN EVENTOS (Diseño Tarjetas) */}
                    <div className="bg-gray-50/50 dark:bg-gray-900/30 p-6 md:p-12 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-display text-2xl font-bold text-mo-text dark:text-white flex items-center gap-3">
                                <FaCalendarAlt className="text-mo-sage" />
                                Próximos Eventos
                            </h2>
                            {isOwner && (
                                <button
                                    onClick={() => navigate(`/evento/nuevo?entidad=${id}`)}
                                    className="px-6 py-2 bg-mo-sage text-white rounded-full font-bold shadow-mo-soft hover:bg-mo-olive transition-all flex items-center gap-2 text-sm"
                                >
                                    <FaPlus size={12} />
                                    Nuevo Evento
                                </button>
                            )}
                        </div>

                        {eventos.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <div className="text-5xl mb-4 opacity-20">📅</div>
                                <p className="text-mo-muted dark:text-gray-500 font-bold">No hay eventos programados en este momento.</p>
                                {isOwner && (
                                    <button
                                        onClick={() => navigate(`/evento/nuevo?entidad=${id}`)}
                                        className="mt-4 text-mo-sage hover:underline font-bold"
                                    >
                                        ¡Sé el primero en crear uno!
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {eventos.map((evento) => (
                                    <div
                                        key={evento.id}
                                        onClick={() => navigate(`/evento/${evento.id}`)}
                                        className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-mo-sage/5 rounded-bl-full transition-all group-hover:scale-150"></div>

                                        <div className="relative">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="px-3 py-1 bg-mo-sage text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                                    Evento PRO
                                                </div>
                                                <div className="text-xs text-mo-muted font-bold font-ui">
                                                    {new Date(evento.fecha_hora_inicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                </div>
                                            </div>
                                            <h3 className="font-display text-xl font-black text-mo-text dark:text-white mb-2 group-hover:text-mo-sage transition-colors">
                                                {evento.titulo}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-mo-muted dark:text-gray-400 font-ui uppercase tracking-widest">
                                                <span className="text-mo-olive">●</span>
                                                {new Date(evento.fecha_hora_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ACCIONES MÓVIL (Sticky Bottom) */}
                {isOwner && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 md:hidden z-50 px-6 w-full max-w-sm">
                        <button
                            onClick={() => navigate(`/entidad/${id}/editar`)}
                            className="flex-1 py-4 bg-mo-olive text-white rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2 animate-bounce-subtle"
                        >
                            <FaEdit /> Editar
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-14 h-14 bg-red-500 text-white rounded-2xl shadow-2xl flex items-center justify-center"
                        >
                            <FaTrash />
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default EntidadDetalle;
