import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaPhoneAlt, FaArrowLeft, FaCheckCircle, FaEdit } from 'react-icons/fa';
import '../../styles/core/core-ui-v11.css';
import { supabase } from '../../lib/supabase';

const ConfirmarTelefono = () => {
    const { theme } = useTheme();
    const { user, downgradeToClient } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isUpgradeMode = location.state?.upgrade || false;
    const [telefono, setTelefono] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user.telefono) {
            setTelefono(user.telefono);
        }
    }, [user]);

    const handleSaltarValidacion = async () => {
        setIsSubmitting(true);
        try {
            if (user?.tipo === 'promotor' || user?.tipo === 'promotor_pendiente') {
                // Si es promotor y salta, se cancela la solicitud y vuelve a cliente
                const result = await downgradeToClient(user.id);
                if (!result.success) throw new Error(result.error);
                console.log('📉 Downgrade a cliente realizado por salto de validación');
            }
            // En cualquier caso, redirigir a ficha cliente
            navigate('/RegistroCliente');
        } catch (error) {
            console.error('Error saltando validación:', error);
            setError('Error al omitir validación. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmar = async () => {
        if (!telefono || telefono.length < 9) {
            setError('Por favor, introduce un teléfono válido.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // 1. Guardar teléfono si se editó
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('usuarios')
                    .update({ telefono, updated_at: new Date().toISOString() })
                    .eq('id', user.id);

                if (updateError) throw updateError;
            }

            // 2. Simular/Enviar SMS (En el futuro llamar a API de SMS)
            console.log('📡 Enviando SMS a:', telefono);

            // 3. Redirigir a verificación
            navigate('/VerificacionSMS', {
                state: {
                    upgrade: isUpgradeMode,
                    telefono: telefono
                }
            });

        } catch (err) {
            console.error('Error:', err);
            setError('Error al procesar la solicitud.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">



                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-mo-coral/10 dark:bg-mo-coral/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-mo-coral">
                            <FaPhoneAlt size={24} />
                        </div>
                        <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white">Validación de Promotor</h1>
                        <p className="text-mo-muted dark:text-gray-400 text-sm mt-2">Confirma tu teléfono para recibir el código de verificación por SMS.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-mo-muted mb-3">Tu número de contacto</label>

                            {isEditing ? (
                                <div className="flex gap-2">
                                    <input
                                        type="tel"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                                        autoFocus
                                        className="flex-1 p-3 bg-white dark:bg-gray-800 border-2 border-mo-coral rounded-xl font-display font-bold text-xl tracking-widest text-mo-text dark:text-white outline-none"
                                        placeholder="600000000"
                                    />
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 bg-mo-sage text-white rounded-xl font-bold text-xs"
                                    >
                                        OK
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <span className="font-display font-black text-2xl tracking-[0.2em] text-mo-text dark:text-white">
                                        {telefono ? `+34 ${telefono}` : 'Sin teléfono'}
                                    </span>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 text-mo-sage hover:bg-mo-sage/10 rounded-lg transition-colors"
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                            )}
                            {error && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase">{error}</p>}
                        </div>

                        <button
                            onClick={handleConfirmar}
                            disabled={isSubmitting || !telefono}
                            className="w-full py-5 bg-mo-coral text-white rounded-2xl font-display font-black text-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            Confirmar y recibir SMS
                        </button>

                        <div className="text-center pt-2">
                            <button
                                onClick={handleSaltarValidacion}
                                disabled={isSubmitting}
                                className="text-xs font-bold text-mo-muted hover:text-mo-text dark:hover:text-white uppercase tracking-widest underline disabled:opacity-50 transition-colors"
                            >
                                No validar ahora {user?.tipo?.includes('promotor') ? '(Volver a Cliente)' : ''}
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-mo-muted dark:text-gray-400 uppercase tracking-widest leading-relaxed">
                            Este paso es obligatorio para activar tu<br />cuenta de promotor profesional
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ConfirmarTelefono;
