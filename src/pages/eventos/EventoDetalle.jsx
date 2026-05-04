import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaEuroSign, FaUser, FaMusic, FaClock, FaInstagram, FaGlobe, FaFacebook, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import '../../styles/core/core-ui-v11.css';

const EventoDetalle = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [evento, setEvento] = useState(null);
    const [redes, setRedes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarEvento();
    }, [id]);

    const cargarEvento = async () => {
        try {
            const { data, error } = await supabase
                .from('eventos')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setEvento(data);
            cargarRedes(data);
        } catch (error) {
            console.error('Error cargando evento:', error);
        } finally {
            setLoading(false);
        }
    };

    const cargarRedes = async (evData) => {
        try {
            const queries = [];
            
            // 1. Redes del Evento (entradas, invitado, etc. introducidas en el formulario)
            queries.push(
                supabase.from('redes_sociales')
                    .select('*')
                    .eq('propietario_id', evData.id)
                    .eq('tipo_propietario', 'evento')
            );

            // 2. Redes del Organizador principal (Entidad)
            if (evData.entidad_id) {
                queries.push(
                    supabase.from('redes_sociales')
                        .select('*')
                        .eq('propietario_id', evData.entidad_id)
                        .eq('tipo_propietario', 'entidad')
                );
            } else if (evData.creador_id) {
                // 3. Redes del Promotor (Si no hay entidad organizadora)
                queries.push(
                    supabase.from('redes_sociales')
                        .select('*')
                        .eq('propietario_id', evData.creador_id)
                        .eq('tipo_propietario', 'promotor')
                );
            }

            // 4. Redes del Local/Bar (entidad_local_id)
            if (evData.entidad_local_id && evData.entidad_local_id !== evData.entidad_id) {
                queries.push(
                    supabase.from('redes_sociales')
                        .select('*')
                        .eq('propietario_id', evData.entidad_local_id)
                        .eq('tipo_propietario', 'entidad')
                );
            }

            // 5. Redes del Artista/Amenizador (entidad_amenizador_id)
            if (evData.entidad_amenizador_id && evData.entidad_amenizador_id !== evData.entidad_id) {
                queries.push(
                    supabase.from('redes_sociales')
                        .select('*')
                        .eq('propietario_id', evData.entidad_amenizador_id)
                        .eq('tipo_propietario', 'entidad')
                );
            }

            const results = await Promise.all(queries);
            let todasLasRedes = [];
            
            results.forEach(({ data, error }) => {
                if (!error && data) {
                    todasLasRedes = [...todasLasRedes, ...data];
                }
            });

            // Eliminar duplicados exactos de URL
            const uniqueRedes = todasLasRedes.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);
            setRedes(uniqueRedes);
        } catch (err) {
            console.error('Error cargando redes:', err);
        }
    };

    const getSocialIcon = (tipo, url = '') => {
        const t = tipo?.toLowerCase() || '';
        const u = url?.toLowerCase() || '';
        if (t.includes('instagram') && u.includes('instagram.com')) return <FaInstagram size={20} />;
        if (t.includes('facebook') && u.includes('facebook.com')) return <FaFacebook size={20} />;
        if (t.includes('tiktok')) return <FaTiktok size={20} />;
        if (t.includes('twitter') || t === 'x') return <FaTwitter size={20} />;
        if (t.includes('youtube')) return <FaYoutube size={20} />;
        if (u.includes('instagram.com')) return <FaInstagram size={20} />;
        if (u.includes('facebook.com')) return <FaFacebook size={20} />;
        return <FaGlobe size={20} />;
    };

    const getSocialColorClass = (tipo, url = '') => {
        const t = tipo?.toLowerCase() || '';
        const u = url?.toLowerCase() || '';
        if (t.includes('instagram') && u.includes('instagram.com')) return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white border-none';
        if (t.includes('facebook') && u.includes('facebook.com')) return 'bg-[#1877F2] text-white border-none';
        if (t.includes('tiktok')) return 'bg-black text-white border-none';
        if (t.includes('twitter') || t === 'x') return 'bg-[#1DA1F2] text-white border-none';
        if (t.includes('youtube')) return 'bg-[#FF0000] text-white border-none';
        if (u.includes('instagram.com')) return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white border-none';
        if (u.includes('facebook.com')) return 'bg-[#1877F2] text-white border-none';
        return 'bg-white dark:bg-gray-700 text-mo-olive border border-gray-100 dark:border-gray-600';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col">
                <Header theme={theme} />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="w-12 h-12 bg-mo-sage/20 rounded-full"></div>
                        <div className="text-mo-muted dark:text-gray-400 font-display font-bold">Cargando evento...</div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!evento) {
        return (
            <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col">
                <Header theme={theme} />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-mo shadow-xl border border-gray-100 dark:border-gray-700 max-w-sm w-full">
                        <div className="text-4xl mb-4">🎫</div>
                        <h2 className="font-display text-xl font-bold text-mo-text dark:text-white mb-2">Evento no encontrado</h2>
                        <p className="text-mo-muted dark:text-gray-400 mb-6">Parece que el enlace no es válido o el evento ha sido cancelado.</p>
                        <button onClick={() => navigate('/agenda')} className="w-full py-3 bg-mo-sage text-white rounded-mo font-bold shadow-mo-soft transition-all active:scale-95">
                            Ver Agenda
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Preparar fechas
    const startDate = new Date(evento.fecha_inicio);
    const day = startDate.toLocaleDateString('es-ES', { day: '2-digit' });
    const month = startDate.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
    const time = startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    let timeString = `${time}`;
    if (evento.fecha_fin) {
        const endDate = new Date(evento.fecha_fin);
        const timeEnd = endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        timeString = `${time} - ${timeEnd}`;
    }

    // URL externa de entradas (si existe en las redes añadidas)
    const ticketRed = redes.find(r => r.tipo_red === 'entradas');
    const ticketUrl = ticketRed ? ticketRed.url : null;
    
    // El resto de redes para los iconos
    const redesIconos = redes.filter(r => r.tipo_red !== 'entradas');

    // Determinar la url de google maps real a usar. En el form, url_evento es el mapa.
    let googleMapsUrl = evento.url_evento || evento.ubicacion_coords || null;
    
    // Si no hay enlace directo, creamos una búsqueda en Google Maps con los datos disponibles
    if (!googleMapsUrl) {
        const addressParts = [
            evento.lugar_manual || evento.ubicacion,
            evento.localidad,
            evento.provincia
        ].filter(Boolean).join(', ');
        
        if (addressParts) {
            googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressParts)}`;
        }
    }

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-4xl mx-auto md:p-6 pb-24">

                {/* BOTÓN VOLVER */}
                <div className="absolute md:relative top-20 left-4 md:top-0 md:left-0 z-40">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-10 h-10 md:w-auto md:px-4 md:py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm md:bg-white dark:md:bg-gray-800 text-mo-muted hover:text-mo-sage rounded-full md:rounded-mo shadow-lg border border-gray-100 dark:border-gray-700 transition-all font-bold group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:block ml-2 text-xs uppercase tracking-widest">Volver</span>
                    </button>
                </div>

                {/* FICHA PREMIUM */}
                <div className="bg-white dark:bg-gray-800 md:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-12 mt-4 md:mt-2">

                    {/* CARTEL HD */}
                    <div className="relative h-[450px] md:h-[600px] bg-black overflow-hidden flex items-center justify-center">
                        {/* Fondo borroso para rellenar */}
                        {evento.imagen_url && (
                            <img src={evento.imagen_url} alt="Fondo" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-2xl scale-110" />
                        )}
                        
                        {/* Cartel nítido y completo */}
                        {evento.imagen_url ? (
                            <img src={evento.imagen_url} alt="Cartel del Evento" className="relative z-10 w-full h-full object-contain p-4 pb-20 md:pb-32 drop-shadow-2xl" />
                        ) : (
                            <div className="relative z-10 w-full h-full flex items-center justify-center opacity-10">
                                <FaCalendarAlt className="text-9xl text-white" />
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>

                        {/* FECHA FLOTANTE EN CARTEL */}
                        <div className="absolute top-6 right-6 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-2xl text-center border-2 border-white dark:border-gray-700 transform rotate-2 hover:rotate-0 transition-transform">
                            <div className="text-red-500 font-bold text-xs uppercase tracking-widest">{month}</div>
                            <div className="text-3xl font-black text-mo-text dark:text-white leading-none mt-1">{day}</div>
                        </div>

                        {/* TÍTULO SUPERPUESTO */}
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                            <div className="flex gap-2 mb-3 flex-wrap">
                                {evento.es_vip && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                                        Destacado PRO
                                    </span>
                                )}
                                {evento.tipo && (
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-bold rounded-full uppercase tracking-widest">
                                        {evento.tipo}
                                    </span>
                                )}
                            </div>
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl">
                                {evento.titulo}
                            </h1>
                        </div>
                    </div>

                    {/* DETALLES Y DATOS */}
                    <div className="p-6 md:p-12 max-w-4xl mx-auto flex flex-col gap-10">
                        
                        {/* 1. ARTISTA / PROTAGONISTA (CENTRADO) */}
                        {evento.amenizador && (
                            <div className="text-center bg-mo-spot/5 p-8 rounded-3xl border border-mo-spot/10 shadow-sm relative overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-mo-spot/5">
                                    <FaMusic size={200} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-xs md:text-sm uppercase tracking-widest font-black text-mo-spot mb-3">Protagonista / En Directo</p>
                                    <h2 className="font-display text-4xl md:text-6xl font-black text-mo-text dark:text-white leading-none mb-6">
                                        {evento.amenizador}
                                    </h2>
                                    <div className="w-20 h-1 bg-mo-spot mx-auto rounded-full"></div>
                                </div>
                            </div>
                        )}

                        {/* 2. INFORMACIÓN LOCAL Y URL */}
                        <div className="flex flex-col gap-6">
                            {/* DESCRIPCIÓN */}
                            {evento.descripcion && (
                                <div className="prose dark:prose-invert max-w-none font-ui text-mo-text dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-center md:text-left text-lg">
                                    {evento.descripcion}
                                </div>
                            )}

                            {/* LUGAR */}
                            <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4 p-6 bg-mo-sage/5 rounded-3xl border border-mo-sage/20 text-center md:text-left shadow-sm">
                                <div className="w-12 h-12 rounded-full bg-mo-sage text-white flex items-center justify-center shrink-0 shadow-md">
                                    <FaMapMarkerAlt size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-black text-mo-sage mb-1">Ubicación</p>
                                    <p className="font-bold text-mo-text dark:text-white text-xl">{evento.lugar_manual || evento.ubicacion || 'Lugar por determinar'}</p>
                                    <p className="text-sm text-mo-muted">{evento.localidad && `${evento.localidad}, `}{evento.provincia}</p>
                                    {googleMapsUrl && (
                                        <a 
                                            href={googleMapsUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 px-6 py-2 bg-white dark:bg-gray-800 text-mo-sage text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                                        >
                                            Ver mapa / Cómo llegar
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* REDES SOCIALES (URL) */}
                            {redesIconos.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    {redesIconos.map((red) => (
                                        <div key={red.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm gap-4">
                                            <a
                                                href={red.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm sm:text-base font-bold text-mo-text dark:text-white hover:text-mo-sage transition-colors truncate w-full sm:w-auto text-center sm:text-left"
                                                title={red.url}
                                            >
                                                {red.url}
                                            </a>
                                            <a
                                                href={red.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full sm:w-auto px-6 py-3 bg-mo-sage text-white text-[10px] uppercase tracking-widest font-black rounded-xl hover:bg-mo-olive transition-all active:scale-95 shrink-0 shadow-md text-center"
                                            >
                                                Visitar
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 3. HORARIO, PRECIO Y ORGANIZADOR */}
                        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            
                            {/* HORARIO */}
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                                <div className="w-12 h-12 rounded-full bg-mo-sage/10 text-mo-sage flex items-center justify-center mb-3">
                                    <FaClock size={20} />
                                </div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-mo-muted mb-2">Horario</p>
                                <p className="font-bold text-mo-text dark:text-white text-xl">{timeString}</p>
                            </div>

                            {/* PRECIO / ENTRADAS */}
                            {(evento.precio_actual !== null || ticketUrl) ? (
                                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                                    <div className="w-12 h-12 rounded-full bg-mo-amber/10 text-mo-amber flex items-center justify-center mb-3">
                                        <FaEuroSign size={20} />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest font-black text-mo-muted mb-2">Entrada</p>
                                    
                                    {evento.precio_actual !== null && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <p className="font-bold text-mo-text dark:text-white text-2xl">
                                                {evento.precio_actual === 0 ? 'Gratis' : `${evento.precio_actual}€`}
                                            </p>
                                            {evento.precio_original > evento.precio_actual && (
                                                <span className="text-sm text-mo-muted line-through">{evento.precio_original}€</span>
                                            )}
                                        </div>
                                    )}
                                    {ticketUrl && (
                                        <a 
                                            href={ticketUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-5 py-2.5 w-full bg-mo-text dark:bg-white text-white dark:text-gray-900 text-xs font-black uppercase tracking-widest rounded-xl shadow-md hover:scale-105 transition-transform mt-auto"
                                        >
                                            Comprar
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden sm:block"></div>
                            )}

                            {/* ORGANIZA */}
                            {evento.creador_nombre ? (
                                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center mb-3">
                                        <FaUser size={20} />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest font-black text-mo-muted mb-2">Organiza</p>
                                    <p className="font-bold text-mo-text dark:text-gray-200 text-lg">{evento.creador_nombre}</p>
                                </div>
                            ) : (
                                <div className="hidden sm:block"></div>
                            )}

                        </div>

                    </div>
                </div>

            </main>

            {/* CALL TO ACTION FLOTANTE MÓVIL (COMPRAR ENTRADAS O IR AL MAPA) */}
            {(googleMapsUrl || ticketUrl) && (
                <div className="fixed bottom-0 left-0 w-full p-4 flex gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 md:hidden z-50">
                    {ticketUrl && (
                        <a 
                            href={ticketUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-mo-text dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold shadow-xl active:scale-95 transition-transform"
                        >
                            Entradas
                        </a>
                    )}
                    {googleMapsUrl && (
                        <a 
                            href={googleMapsUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-mo-sage text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-transform"
                        >
                            <FaMapMarkerAlt /> Mapa
                        </a>
                    )}
                </div>
            )}

            <Footer />
        </div>
    );
};

export default EventoDetalle;
