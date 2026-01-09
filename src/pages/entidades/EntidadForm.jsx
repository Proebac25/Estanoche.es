import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaSave, FaArrowLeft, FaStore, FaMusic, FaTheaterMasks, FaCamera, FaPlus } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import '../../styles/core/core-ui-v11.css';

const EntidadForm = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        nombre: '',
        tipo_entidad: 'local',
        descripcion: '',
        direccion: '',
        avatar_url: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!user || user.tipo !== 'promotor') {
            navigate('/RegistroPromotor');
            return;
        }

        if (isEditing) {
            cargarEntidad();
        }
    }, [user, id]);

    const cargarEntidad = async () => {
        try {
            const { data, error } = await supabase
                .from('entidades')
                .select('*')
                .eq('id', id)
                .eq('usuario_id', user.id)
                .single();

            if (error) throw error;

            setFormData({
                nombre: data.nombre || '',
                tipo_entidad: data.tipo_entidad || 'local',
                descripcion: data.descripcion || '',
                direccion: data.direccion || '',
                avatar_url: data.avatar_url || ''
            });
        } catch (error) {
            console.error('Error cargando entidad:', error);
            setMessage({ type: 'error', text: 'Error al cargar la entidad' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        // Validaciones
        if (!formData.nombre.trim()) {
            setMessage({ type: 'error', text: 'El nombre es obligatorio' });
            setIsSubmitting(false);
            return;
        }

        if (formData.tipo_entidad === 'local' && !formData.direccion.trim()) {
            setMessage({ type: 'error', text: 'La dirección es obligatoria para locales' });
            setIsSubmitting(false);
            return;
        }

        try {
            const entidadData = {
                nombre: formData.nombre.trim(),
                tipo_entidad: formData.tipo_entidad,
                descripcion: formData.descripcion.trim(),
                direccion: formData.direccion.trim(),
                avatar_url: formData.avatar_url,
                usuario_id: user.id
            };

            if (isEditing) {
                // Actualizar
                const { error } = await supabase
                    .from('entidades')
                    .update(entidadData)
                    .eq('id', id)
                    .eq('usuario_id', user.id);

                if (error) throw error;

                setMessage({ type: 'success', text: 'Entidad actualizada correctamente' });
                setTimeout(() => navigate('/entidades'), 1500);
            } else {
                // Crear
                const { data, error } = await supabase
                    .from('entidades')
                    .insert([entidadData])
                    .select()
                    .single();

                if (error) throw error;

                setMessage({ type: 'success', text: 'Entidad creada correctamente' });
                setTimeout(() => navigate('/entidades'), 1500);
            }
        } catch (error) {
            console.error('Error guardando entidad:', error);
            setMessage({ type: 'error', text: `Error: ${error.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTipoIcon = () => {
        switch (formData.tipo_entidad) {
            case 'local': return <FaStore size={20} />;
            case 'actividad': return <FaTheaterMasks size={20} />;
            case 'amenizador': return <FaMusic size={20} />;
            default: return <FaStore size={20} />;
        }
    };

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-2xl mx-auto p-3 md:p-6">
                <div className="p-2">
                    {/* Título */}
                    <div className="mb-4 flex items-center gap-3">
                        <button
                            onClick={() => navigate('/entidades')}
                            className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-mo hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FaArrowLeft size={16} />
                        </button>
                        <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white">
                            {isEditing ? 'Editar Entidad' : 'Nueva Entidad'}
                        </h1>
                    </div>

                    {/* Mensaje */}
                    {message.text && (
                        <div className={`mb-4 p-3 rounded-mo font-ui text-center text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Avatar */}
                        <div className="text-center mb-3">
                            <div className="relative inline-block group">
                                <div
                                    onClick={() => document.getElementById('entidad-avatar-input').click()}
                                    className="w-20 h-20 rounded-mo bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-mo-muted dark:text-gray-500 border-2 border-mo-surface dark:border-gray-800 shadow-sm overflow-hidden cursor-pointer relative"
                                >
                                    {formData.avatar_url ? (
                                        <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-mo-sage">
                                            {getTipoIcon()}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FaCamera className="text-white" size={20} />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-mo-sage text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm">
                                    <FaPlus size={10} />
                                </div>
                            </div>
                            <input
                                type="file"
                                id="entidad-avatar-input"
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    // Aquí iría la lógica de subida de imagen
                                    // Por ahora solo guardamos un URL temporal
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        setFormData({ ...formData, avatar_url: e.target.result });
                                    };
                                    reader.readAsDataURL(file);
                                }}
                            />
                        </div>

                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-bold text-mo-text dark:text-white mb-2">
                                Nombre de la entidad *
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="w-full p-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all"
                                placeholder="Ej: Bar El Rincón, DJ Manolo, Fiesta de los 80..."
                                required
                            />
                        </div>

                        {/* Tipo de Entidad */}
                        <div>
                            <label className="block text-sm font-bold text-mo-text dark:text-white mb-2">
                                Tipo de entidad *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, tipo_entidad: 'local' })}
                                    className={`p-4 rounded-mo border-2 transition-all ${formData.tipo_entidad === 'local' ? 'border-mo-sage bg-mo-sage/10 text-mo-sage' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-mo-muted dark:text-gray-400'}`}
                                >
                                    <FaStore size={24} className="mx-auto mb-2" />
                                    <div className="font-bold text-sm">Local</div>
                                    <div className="text-xs">Espacio Físico</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, tipo_entidad: 'actividad' })}
                                    className={`p-4 rounded-mo border-2 transition-all ${formData.tipo_entidad === 'actividad' ? 'border-mo-sage bg-mo-sage/10 text-mo-sage' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-mo-muted dark:text-gray-400'}`}
                                >
                                    <FaTheaterMasks size={24} className="mx-auto mb-2" />
                                    <div className="font-bold text-sm">Actividad</div>
                                    <div className="text-xs">Quedada Social</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, tipo_entidad: 'amenizador' })}
                                    className={`p-4 rounded-mo border-2 transition-all ${formData.tipo_entidad === 'amenizador' ? 'border-mo-sage bg-mo-sage/10 text-mo-sage' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-mo-muted dark:text-gray-400'}`}
                                >
                                    <FaMusic size={24} className="mx-auto mb-2" />
                                    <div className="font-bold text-sm">Amenizador</div>
                                    <div className="text-xs">DJ / Artista</div>
                                </button>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-bold text-mo-text dark:text-white mb-2">
                                Descripción
                            </label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="4"
                                className="w-full p-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all resize-none"
                                placeholder="Describe tu entidad, servicios, especialidad..."
                            />
                        </div>

                        {/* Dirección (obligatoria solo para locales) */}
                        <div>
                            <label className="block text-sm font-bold text-mo-text dark:text-white mb-2">
                                Dirección {formData.tipo_entidad === 'local' && '*'}
                            </label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                className="w-full p-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all"
                                placeholder="Calle, Número, Ciudad, Provincia"
                                required={formData.tipo_entidad === 'local'}
                            />
                            <div className="text-xs text-mo-muted dark:text-gray-400 mt-1">
                                {formData.tipo_entidad === 'local'
                                    ? 'Obligatoria para locales físicos'
                                    : 'Opcional para actividades y amenizadores'
                                }
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/entidades')}
                                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-mo-text dark:text-white rounded-mo font-bold shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-mo-sage hover:bg-mo-olive text-white rounded-mo font-bold shadow-mo-soft transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <FaSave size={16} />
                                {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Entidad')}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EntidadForm;
