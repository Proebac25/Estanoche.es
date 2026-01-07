import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaPhoneAlt, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import '../../styles/core/core-ui-v11.css';
import { supabase } from '../../lib/supabase';

const RegistroMovil = () => {
    const { theme } = useTheme();
    const { user, upgradeToPromoter } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isUpgradeMode = location.state?.upgrade || false;

    const [telefono, setTelefono] = useState('');
    const [prefijo, setPrefijo] = useState('+34');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleTelefonoChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 9) value = value.slice(0, 9);

        if (value.length > 5) {
            value = `${value.slice(0, 3)} ${value.slice(3, 5)} ${value.slice(5, 7)} ${value.slice(7)}`;
        } else if (value.length > 3) {
            value = `${value.slice(0, 3)} ${value.slice(3)}`;
        }

        setTelefono(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const telLimpio = telefono.replace(/\s/g, '');

        if (telLimpio.length < 9) {
            setError('Introduce un número de teléfono válido.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const { error: updateError } = await supabase
                .from('usuarios')
                .update({
                    telefono: telLimpio,
                    prefijo_telefono: prefijo,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            if (isUpgradeMode) {
                const upgradeResult = await upgradeToPromoter(user.id);
                if (!upgradeResult.success) {
                    throw new Error('Móvil guardado pero el cambio a promotor falló: ' + upgradeResult.error);
                }
            } else {
                const updatedUser = { ...user, telefono: telLimpio, prefijo_telefono: prefijo };
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
            }

            setSuccess(true);
            setTimeout(() => {
                if (isUpgradeMode) {
                    navigate('/RegistroPromotor');
                } else {
                    navigate('/RegistroCliente');
                }
            }, 2000);

        } catch (err) {
            console.error('Error al registrar móvil:', err);
            setError('Hubo un error al procesar tu solicitud: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />
            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-mo-muted hover:text-mo-text dark:hover:text-white transition-colors mb-8"
                    >
                        <FaArrowLeft size={14} />
                        <span className="text-sm font-bold">Volver</span>
                    </button>

                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                <FaCheckCircle size={40} />
                            </div>
                            <h2 className="font-display text-2xl font-bold text-mo-text dark:text-white mb-2">¡Móvil registrado!</h2>
                            <p className="text-mo-muted dark:text-gray-400">Tu número ha sido guardado correctamente. Redirigiendo...</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-mo-olive/10 dark:bg-mo-olive/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#4B744D]">
                                    <FaPhoneAlt size={24} />
                                </div>
                                <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white">Registra tu móvil</h1>
                                <p className="text-mo-muted dark:text-gray-400 text-sm mt-2">Necesitamos tu teléfono para verificar tu cuenta y permitirte ser promotor.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-mo-text dark:text-gray-300 mb-2">
                                        Número de teléfono
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={prefijo}
                                            onChange={(e) => setPrefijo(e.target.value)}
                                            className="w-20 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-center font-bold text-mo-text dark:text-white focus:ring-2 focus:ring-[#4B744D] outline-none"
                                        />
                                        <input
                                            type="tel"
                                            value={telefono}
                                            onChange={handleTelefonoChange}
                                            placeholder="600 00 00 00"
                                            className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-display font-bold text-lg text-mo-text dark:text-white tracking-widest focus:ring-2 focus:ring-[#4B744D] outline-none"
                                            required
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-[#4B744D] text-white rounded-2xl font-display font-black text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Guardando...' : 'Confirmar Registro'}
                                </button>
                                <p className="text-center text-[10px] text-mo-muted dark:text-gray-500 uppercase tracking-widest font-bold">
                                    Recibirás un código de verificación por SMS
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegistroMovil;
