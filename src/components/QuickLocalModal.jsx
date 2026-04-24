import React, { useState } from 'react';
import { FaSave, FaTimes, FaMapMarkerAlt, FaCity } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import GeographyInputs from './GeographyInputs';

const QuickLocalModal = ({ isOpen, onClose, onCreated, userId }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        calle: '',
        numero: '',
        ciudad: '',
        provincia: '',
        codigo_postal: '',
        direccion: ''
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

        if (!formData.nombre || !formData.calle || !formData.ciudad) {
            setError('Nombre, Calle y Ciudad son obligatorios');
            setIsSubmitting(false);
            return;
        }

        try {
            // Estructura conforme a la tabla entidades
            const entidadData = {
                nombre: formData.nombre,
                tipo_entidad: 'local',
                calle: formData.calle,
                numero: formData.numero,
                ciudad: formData.ciudad,
                provincia: formData.provincia,
                codigo_postal: formData.codigo_postal,
                direccion: formData.direccion,
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

            // También creamos la relación de 'colaborador' (o similar) para el animador
            await supabase.from('relaciones_entidades').insert([{
                entidad_id: data.id,
                usuario_id: userId,
                rol: 'colaborador' // El animador es colaborador/creador del registro provisional
            }]);

            onCreated(data);
            onClose();
        } catch (err) {
            console.error('Error creando local rápido:', err);
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
                        <FaMapMarkerAlt className="text-mo-sage" />
                        Registrar Nuevo Local
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
                        <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted mb-1">Nombre del Lugar *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl outline-none text-sm dark:text-white border border-transparent focus:border-mo-sage"
                            placeholder="Ej: Pub La Clave"
                            required
                        />
                    </div>

                    {/* SECCIÓN: DIRECCIÓN (ESTILO CAJA PREMIUM) */}
                    <div className="p-4 bg-mo-bg/50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4 shadow-inner">
                        <h3 className="text-[10px] uppercase tracking-widest font-black text-mo-muted px-2">Ubicación del Local</h3>

                        <GeographyInputs 
                            provinciaValue={formData.provincia}
                            municipioValue={formData.ciudad}
                            cpValue={formData.codigo_postal}
                            onChange={handleChange}
                            required={true}
                        />

                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted mb-1">Calle *</label>
                                <input
                                    type="text"
                                    name="calle"
                                    value={formData.calle}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white dark:bg-gray-800 rounded-xl outline-none text-sm dark:text-white shadow-sm"
                                    placeholder="Dirección"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted mb-1">Nº</label>
                                <input
                                    type="text"
                                    name="numero"
                                    value={formData.numero}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white dark:bg-gray-800 rounded-xl outline-none text-sm dark:text-white shadow-sm"
                                    placeholder="12"
                                />
                            </div>
                        </div>

                        {/* URL Google Maps */}
                        <div className="pt-2">
                            <input
                                type="url"
                                name="direccion"
                                value={formData.direccion || ''}
                                onChange={handleChange}
                                className="w-full p-3 bg-white dark:bg-gray-800 border border-transparent focus:border-mo-sage rounded-xl outline-none text-mo-text dark:text-white transition-all text-[10px] shadow-sm"
                                placeholder="Enlace de Google Maps (ej: https://maps.app.goo.gl/...)"
                            />
                        </div>
                    </div>


                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-mo-sage hover:bg-mo-olive text-white rounded-2xl font-bold text-sm shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                    >
                        <FaSave />
                        {isSubmitting ? 'Guardando...' : 'Registrar Local Provisional'}
                    </button>
                    <p className="text-[9px] text-mo-muted italic text-center mt-2">
                        * Al registrarlo, el local aparecerá como "No Verificado" hasta que el dueño lo reclame.
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

export default QuickLocalModal;
