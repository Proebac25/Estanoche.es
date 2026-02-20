import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaPlus, FaEdit, FaTrash, FaStore, FaMusic, FaTheaterMasks, FaEye, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import '../../styles/core/core-ui-v11.css';

const EntidadesList = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [entidades, setEntidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos'); // 'todos', 'local', 'actividad', 'amenizador'
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!user) {
            navigate('/RegistroPromotor');
            return;
        }

        if (user.tipo !== 'promotor') {
            setMessage({ type: 'error', text: 'Solo los promotores pueden gestionar entidades.' });
            setTimeout(() => navigate('/'), 3000);
            return;
        }

        cargarEntidades();
    }, [user]);

    const cargarEntidades = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('entidades')
                .select('*')
                .eq('usuario_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Error al cargar entidades:', error);
                setMessage({ type: 'error', text: 'Error al cargar entidades' });
            } else {
                console.log('✅ Entidades cargadas:', data.length);
                setEntidades(data || []);
            }
        } catch (error) {
            console.error('💥 Error:', error);
            setMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, nombre) => {
        if (!window.confirm(`¿Seguro que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('entidades')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('❌ Error al eliminar:', error);
                setMessage({ type: 'error', text: 'Error al eliminar entidad' });
            } else {
                setMessage({ type: 'success', text: 'Entidad eliminada correctamente' });
                cargarEntidades();
            }
        } catch (error) {
            console.error('💥 Error:', error);
            setMessage({ type: 'error', text: 'Error de conexión' });
        }
    };

    const getEntidadIcon = (tipo) => {
        switch (tipo) {
            case 'local': return <FaStore size={24} />;
            case 'actividad': return <FaTheaterMasks size={24} />;
            case 'amenizador': return <FaMusic size={24} />;
            default: return <FaStore size={24} />;
        }
    };

    const gettipoLabel = (tipo) => {
        switch (tipo) {
            case 'local': return 'Local / Espacio Físico';
            case 'actividad': return 'Actividad Social';
            case 'amenizador': return 'Amenizador / Artista';
            default: return tipo;
        }
    };

    const entidadesFiltradas = filtro === 'todos'
        ? entidades
        : entidades.filter(e => e.tipo_entidad === filtro);

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-4xl mx-auto p-3 md:p-6">
                <div className="p-2">
                    {/* Título y botón crear */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/RegistroPromotor')}
                                className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <FaArrowLeft size={16} className="text-mo-muted" />
                            </button>
                            <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white">
                                Mis Entidades
                            </h1>
                        </div>
                        <button
                            onClick={() => navigate('/entidad/nueva')}
                            className="flex items-center gap-2 px-4 py-2 bg-mo-sage hover:bg-mo-olive text-white rounded-mo shadow-mo-soft transition-all active:scale-95"
                        >
                            <FaPlus size={14} />
                            <span className="font-bold text-sm">Nueva</span>
                        </button>
                    </div>

                    {/* Mensaje de feedback */}
                    {message.text && (
                        <div className={`mb-4 p-3 rounded-mo font-ui text-center text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Filtros */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        <button
                            onClick={() => setFiltro('todos')}
                            className={`px-4 py-2 rounded-mo font-ui text-sm font-bold transition-all whitespace-nowrap ${filtro === 'todos' ? 'bg-mo-sage text-white shadow-mo-soft' : 'bg-white dark:bg-gray-800 text-mo-muted dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}
                        >
                            Todas ({entidades.length})
                        </button>
                        <button
                            onClick={() => setFiltro('local')}
                            className={`px-4 py-2 rounded-mo font-ui text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${filtro === 'local' ? 'bg-mo-sage text-white shadow-mo-soft' : 'bg-white dark:bg-gray-800 text-mo-muted dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <FaStore size={14} />
                            Locales ({entidades.filter(e => e.tipo_entidad === 'local').length})
                        </button>
                        <button
                            onClick={() => setFiltro('actividad')}
                            className={`px-4 py-2 rounded-mo font-ui text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${filtro === 'actividad' ? 'bg-mo-sage text-white shadow-mo-soft' : 'bg-white dark:bg-gray-800 text-mo-muted dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <FaTheaterMasks size={14} />
                            Actividades ({entidades.filter(e => e.tipo_entidad === 'actividad').length})
                        </button>
                        <button
                            onClick={() => setFiltro('amenizador')}
                            className={`px-4 py-2 rounded-mo font-ui text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${filtro === 'amenizador' ? 'bg-mo-sage text-white shadow-mo-soft' : 'bg-white dark:bg-gray-800 text-mo-muted dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <FaMusic size={14} />
                            Amenizadores ({entidades.filter(e => e.tipo_entidad === 'amenizador').length})
                        </button>
                    </div>

                    {/* Lista de entidades */}
                    {loading ? (
                        <div className="text-center py-12 text-mo-muted dark:text-gray-400">
                            Cargando entidades...
                        </div>
                    ) : entidadesFiltradas.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-mo border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <div className="text-mo-muted dark:text-gray-400 mb-4">
                                {filtro === 'todos' ? 'No tienes entidades creadas aún.' : `No tienes ${filtro}s creados.`}
                            </div>
                            <button
                                onClick={() => navigate('/entidad/nueva')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-mo-sage hover:bg-mo-olive text-white rounded-mo shadow-mo-soft transition-all active:scale-95"
                            >
                                <FaPlus size={14} />
                                <span className="font-bold">Crear primera entidad</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {entidadesFiltradas.map((entidad) => (
                                <div
                                    key={entidad.id}
                                    className="bg-white dark:bg-gray-800 rounded-mo shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
                                >
                                    {/* Header con icono y tipo */}
                                    <div className="p-4 bg-mo-sage/5 dark:bg-mo-sage/10 border-b border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-mo bg-white dark:bg-gray-700 flex items-center justify-center text-mo-sage overflow-hidden border border-gray-100 dark:border-gray-600">
                                                {entidad.avatar_url ? (
                                                    <img src={entidad.avatar_url} alt={entidad.nombre} className="w-full h-full object-contain p-1" />
                                                ) : (
                                                    getEntidadIcon(entidad.tipo_entidad)
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-display font-bold text-lg text-mo-text dark:text-white">
                                                    {entidad.nombre}
                                                </h3>
                                                <div className="text-xs text-mo-muted dark:text-gray-400 font-ui">
                                                    {gettipoLabel(entidad.tipo_entidad)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-4">
                                        {entidad.descripcion && (
                                            <p className="text-sm text-mo-muted dark:text-gray-400 mb-3 line-clamp-2">
                                                {entidad.descripcion}
                                            </p>
                                        )}

                                        {(entidad.calle || entidad.ciudad) && (
                                            <div className="text-xs text-mo-muted dark:text-gray-400 mb-3 truncate">
                                                📍 {entidad.calle} {entidad.ciudad && `- ${entidad.ciudad}`}
                                            </div>
                                        )}

                                        {/* Botones de acción */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/entidad/${entidad.id}`)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-mo-text dark:text-white rounded-mo hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm font-bold"
                                            >
                                                <FaEye size={14} />
                                                Ver
                                            </button>
                                            <button
                                                onClick={() => navigate(`/entidad/${entidad.id}/editar`)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-mo-olive text-white rounded-mo hover:opacity-90 transition-all text-sm font-bold"
                                            >
                                                <FaEdit size={14} />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(entidad.id, entidad.nombre)}
                                                className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-mo hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                                                title="Eliminar"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EntidadesList;
