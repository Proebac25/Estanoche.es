import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaSave, FaArrowLeft, FaCalendarAlt, FaImage, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { validateImageSize, IMAGE_LIMITS } from '../../utils/validators';
import '../../styles/core/core-ui-v11.css';

const EventoForm = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const entidadId = searchParams.get('entidad');

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha_hora_inicio: '',
        ubicacion: '',
        imagen_url: '',
        entidad_id: entidadId || ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!user) {
            navigate('/RegistroPromotor');
            return;
        }
        if (!entidadId) {
            navigate('/entidades');
        }
    }, [user, entidadId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tamaño (256KB para VENTOS/CONCIERTOS)
        const validation = validateImageSize(file, IMAGE_LIMITS.EVENTO, 'el cartel/imagen del evento');

        if (!validation.isValid) {
            setMessage({ type: 'error', text: validation.error });
            e.target.value = '';
            return;
        }

        if (message.type === 'error') setMessage({ type: '', text: '' });

        const reader = new FileReader();
        reader.onload = (e) => {
            setFormData(prev => ({ ...prev, imagen_url: e.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        if (!formData.titulo.trim() || !formData.fecha_hora_inicio) {
            setMessage({ type: 'error', text: 'El título y la fecha son obligatorios' });
            setIsSubmitting(false);
            return;
        }

        try {
            const { error } = await supabase
                .from('eventos')
                .insert([{
                    ...formData,
                    usuario_id: user.id
                }]);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Evento creado correctamente' });
            setTimeout(() => navigate(`/entidad/${entidadId}`), 1500);
        } catch (error) {
            console.error('Error guardando evento:', error);
            setMessage({ type: 'error', text: `Error: ${error.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8">
                <div className="bg-white dark:bg-gray-800 rounded-mo shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <FaArrowLeft size={16} className="text-mo-muted" />
                        </button>
                        <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white">
                            Nuevo Evento
                        </h1>
                    </div>

                    {message.text && (
                        <div className={`m-6 p-4 rounded-mo font-ui text-center text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* IMAGEN DEL EVENTO */}
                        <div className="space-y-2">
                            <label className="block text-xs uppercase tracking-widest font-black text-mo-muted">Cartel del Evento (Máx. 256KB)</label>
                            <div
                                onClick={() => document.getElementById('event-img').click()}
                                className="w-full h-48 bg-gray-50 dark:bg-gray-900 rounded-mo border-2 border-dashed border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer flex items-center justify-center group"
                            >
                                {formData.imagen_url ? (
                                    <img src={formData.imagen_url} alt="Cartel" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-center text-mo-muted">
                                        <FaImage size={32} className="mx-auto mb-2 opacity-50" />
                                        <span className="text-xs font-bold uppercase">Subir Cartel / Flyer</span>
                                    </div>
                                )}
                            </div>
                            <input id="event-img" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest font-black text-mo-muted mb-2">Título del Evento *</label>
                            <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-mo outline-none text-mo-text dark:text-white"
                                placeholder="Ej: Concierto de Jazz, Gran Inauguración..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-black text-mo-muted mb-2">Fecha y Hora *</label>
                                <div className="relative">
                                    <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-mo-sage" />
                                    <input
                                        type="datetime-local"
                                        name="fecha_hora_inicio"
                                        value={formData.fecha_hora_inicio}
                                        onChange={handleChange}
                                        className="w-full p-4 pl-12 bg-gray-50 dark:bg-gray-900 rounded-mo outline-none text-mo-text dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-black text-mo-muted mb-2">Ubicación / Sala</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-mo-sage" />
                                    <input
                                        type="text"
                                        name="ubicacion"
                                        value={formData.ubicacion}
                                        onChange={handleChange}
                                        className="w-full p-4 pl-12 bg-gray-50 dark:bg-gray-900 rounded-mo outline-none text-mo-text dark:text-white"
                                        placeholder="Ej: Sala Principal..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest font-black text-mo-muted mb-2">Descripción</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="4"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-mo outline-none text-mo-text dark:text-white resize-none"
                                placeholder="Detalles del evento..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-mo-sage hover:bg-mo-olive text-white rounded-mo font-bold text-lg shadow-mo-soft transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : 'Publicar Evento'}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EventoForm;
