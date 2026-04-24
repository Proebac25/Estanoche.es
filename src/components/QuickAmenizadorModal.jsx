import React, { useState } from 'react';
import { FaSave, FaTimes, FaMusic, FaUserAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import GeographyInputs from './GeographyInputs';

const QuickAmenizadorModal = ({ isOpen, onClose, onCreated, userId }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        categoria_entidad: '',
        email: '',
        descripcion: '',
        ciudad: '',
        provincia: '',
        codigo_postal: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!formData.nombre || !formData.provincia || !formData.ciudad) {
            setError('El nombre, la provincia y la ciudad son obligatorios');
            setIsSubmitting(false);
            return;
        }

        try {
            const entidadData = {
                nombre: formData.nombre,
                tipo_entidad: 'amenizador',
                categoria_entidad: formData.categoria_entidad,
                email: formData.email || null,
                descripcion: formData.descripcion,
                ciudad: formData.ciudad,
                provincia: formData.provincia,
                codigo_postal: formData.codigo_postal,
                usuario_id: userId,
                estado_entidad: 'verificado',
                email_verificado: false
            };

            const { data, error: insertError } = await supabase
                .from('entidades')
                .insert([entidadData])
                .select()
                .single();

            if (insertError) throw insertError;

            // Relación de colaboración
            await supabase.from('relaciones_entidades').insert([{
                entidad_id: data.id,
                usuario_id: userId,
                rol: 'colaborador'
            }]);

            onCreated(data);
            onClose();
        } catch (err) {
            console.error('Error creando amenizador rápido:', err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-slide-up">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-mo-bg/30 dark:bg-gray-900/30">
                    <h2 className="text-xl font-display font-bold text-mo-text dark:text-white flex items-center gap-2">
                        <FaMusic className="text-mo-sage" />
                        Nuevo Animador / Artista
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-mo-text dark:hover:text-white transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-800/30">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted mb-1 px-1">Nombre Artístico *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none text-sm dark:text-white border border-transparent focus:border-mo-sage shadow-sm"
                            placeholder="Ej: DJ Alexander, Orquesta Luna..."
                            required
                        />
                    </div>

                    {/* SECCIÓN: UBICACIÓN (ESTILO CAJA PREMIUM - IGUAL QUE LOCALES) */}
                    <div className="p-4 bg-mo-bg/50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4 shadow-inner">
                        <h3 className="text-[10px] uppercase tracking-widest font-black text-mo-muted px-2 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-mo-sage opacity-50" />
                            Base de Operaciones / Ubicación
                        </h3>

                        <GeographyInputs 
                            provinciaValue={formData.provincia}
                            municipioValue={formData.ciudad}
                            cpValue={formData.codigo_postal}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted mb-1 px-1">Tipo de Animador</label>
                            <input
                                type="text"
                                name="categoria_entidad"
                                value={formData.categoria_entidad}
                                onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none text-sm dark:text-white border border-transparent focus:border-mo-sage shadow-sm"
                                placeholder="Ej: DJ, Banda, Mago..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted mb-1 px-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none text-sm dark:text-white border border-transparent focus:border-mo-sage shadow-sm"
                                placeholder="artista@ejemplo.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted mb-1 px-1">Descripción Breve</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows="2"
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none text-sm dark:text-white border border-transparent focus:border-mo-sage shadow-sm resize-none"
                            placeholder="Cuéntanos un poco sobre el artista..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-mo-sage hover:bg-mo-olive text-white rounded-2xl font-bold text-sm shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                    >
                        <FaUserAlt />
                        {isSubmitting ? 'Guardando...' : 'Registrar Artista Provisional'}
                    </button>
                    <p className="text-[9px] text-mo-muted italic text-center mt-2">
                        * Al registrarlo, el artista aparecerá como "No Verificado" hasta que el dueño lo reclame.
                    </p>
                </form>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                .animate-slide-up { animation: slideUp 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default QuickAmenizadorModal;
