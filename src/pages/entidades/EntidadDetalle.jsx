import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaArrowLeft, FaEdit, FaTrash, FaStore, FaMusic, FaTheaterMasks, FaPlus } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import '../../styles/core/core-ui-v11.css';

const EntidadDetalle = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [entidad, setEntidad] = useState(null);
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!user) {
            navigate('/RegistroPromotor');
            return;
        }
        cargarEntidad();
        cargarEventos();
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

    const cargarEventos = async () => {
        try {
            const { data, error } = await supabase
                .from('eventos')
                .select('*')
                .eq('entidad_id', id)
                .order('fecha_hora_inicio', { ascending: false })
                .limit(5);

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
            case 'local': return <FaStore size={32} />;
            case 'actividad': return <FaTheaterMasks size={32} />;
            case 'amenizador': return <FaMusic size={32} />;
            default: return <FaStore size={32} />;
        }
    };

    const getTipoLabel = (tipo) => {
        switch (tipo) {
            case 'local': return 'Local / Espacio Físico';
            case 'actividad': return 'Actividad Social';
            case 'amenizador': return 'Amenizador / Artista';
            default: return tipo;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col">
                <Header theme={theme} />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-mo-muted dark:text-gray-400">Cargando...</div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!entidad) {
        return (
            <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col">
                <Header theme={theme} />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-mo-muted dark:text-gray-400 mb-4">Entidad no encontrada</div>
                        <button onClick={() => navigate('/entidades')} className="px-4 py-2 bg-mo-sage text-white rounded-mo">
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

            <main className="flex-1 w-full max-w-3xl mx-auto p-3 md:p-6">
                <div className="p-2">
                    {/* Navegación */}
                    <button
                        onClick={() => navigate('/entidades')}
                        className="mb-4 flex items-center gap-2 text-mo-muted dark:text-gray-400 hover:text-mo-sage transition-colors"
                    >
                        <FaArrowLeft size={14} />
                        <span className="text-sm">Volver a mis entidades</span>
                    </button>

                    {/* Mensaje */}
                    {message.text && (
                        <div className={`mb-4 p-3 rounded-mo font-ui text-center text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Header de la entidad */}
                    <div className="bg-white dark:bg-gray-800 rounded-mo shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-20 h-20 rounded-mo bg-mo-sage/20 dark:bg-mo-sage/30 flex items-center justify-center text-mo-sage shrink-0">
                                    {entidad.avatar_url ? (
                                        <img src={entidad.avatar_url} alt={entidad.nombre} className="w-full h-full object-cover rounded-mo" />
                                    ) : (
                                        getEntidadIcon(entidad.tipo_entidad)
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white mb-1">
                                        {entidad.nombre}
                                    </h1>
                                    <div className="text-sm text-mo-muted dark:text-gray-400 font-ui">
                                        {getTipoLabel(entidad.tipo_entidad)}
                                    </div>
                                </div>
                            </div>

                            {entidad.descripcion && (
                                <p className="text-mo-muted dark:text-gray-400 mb-4">
                                    {entidad.descripcion}
                                </p>
                            )}

                            {entidad.direccion && (
                                <div className="flex items-start gap-2 text-sm text-mo-muted dark:text-gray-400 mb-4">
                                    <span>📍</span>
                                    <span>{entidad.direccion}</span>
                                </div>
                            )}

                            {/* Botones de acción */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate(`/entidad/${id}/editar`)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-mo-olive text-white rounded-mo hover:opacity-90 transition-all font-bold"
                                >
                                    <FaEdit size={14} />
                                    Editar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-mo hover:bg-red-200 dark:hover:bg-red-900/50 transition-all font-bold"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sección de eventos */}
                    <div className="bg-white dark:bg-gray-800 rounded-mo shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="font-display text-lg font-bold text-mo-text dark:text-white">
                                Eventos ({eventos.length})
                            </h2>
                            <button
                                onClick={() => navigate(`/evento/nuevo?entidad=${id}`)}
                                className="flex items-center gap-2 px-3 py-2 bg-mo-sage text-white rounded-mo hover:bg-mo-olive transition-all text-sm font-bold"
                            >
                                <FaPlus size={12} />
                                Nuevo Evento
                            </button>
                        </div>

                        <div className="p-4">
                            {eventos.length === 0 ? (
                                <div className="text-center py-8 text-mo-muted dark:text-gray-400">
                                    <div className="mb-3">No hay eventos para esta entidad</div>
                                    <button
                                        onClick={() => navigate(`/evento/nuevo?entidad=${id}`)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-mo-sage text-white rounded-mo hover:bg-mo-olive transition-all"
                                    >
                                        <FaPlus size={12} />
                                        Crear primer evento
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {eventos.map((evento) => (
                                        <div
                                            key={evento.id}
                                            onClick={() => navigate(`/evento/${evento.id}`)}
                                            className="p-3 bg-gray-50 dark:bg-gray-900 rounded-mo hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                        >
                                            <h3 className="font-bold text-mo-text dark:text-white mb-1">
                                                {evento.titulo}
                                            </h3>
                                            <div className="text-sm text-mo-muted dark:text-gray-400">
                                                {evento.fecha_hora_inicio && new Date(evento.fecha_hora_inicio).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EntidadDetalle;
