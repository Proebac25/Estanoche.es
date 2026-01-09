import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { authService } from '../../lib/authService';
import '../../styles/core/core-ui-v11.css';

const RecuperarPassword = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [emailEnviado, setEmailEnviado] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        if (!email.trim()) {
            setMessage({ type: 'error', text: 'El email es obligatorio' });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/send-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase() })
            });

            const result = await response.json();

            if (result.success) {
                setEmailEnviado(true);
                setMessage({
                    type: 'success',
                    text: 'Te hemos enviado un código de 6 dígitos a tu email. Revisa tu bandeja de entrada.'
                });
            } else {
                setMessage({
                    type: 'error',
                    text: result.error | 'Error al enviar el código de recuperación'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'error', text: 'Error de conexión. Inténtalo de nuevo.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-red-500 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-md mx-auto p-3 md:p-6 flex items-center">
                <div className="w-full p-2">
                    <button
                        onClick={() => navigate('/')}
                        className="mb-4 flex items-center gap-2 text-mo-muted dark:text-gray-400 hover:text-mo-sage transition-colors"
                    >
                        <FaArrowLeft size={14} />
                        <span className="text-sm">Volver</span>
                    </button>

                    {/* Título */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-mo-sage/20 dark:bg-mo-sage/30 flex items-center justify-center">
                            <FaEnvelope className="text-mo-sage" size={28} />
                        </div>
                        <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white mb-2">
                            Recuperar Contraseña
                        </h1>
                        <p className="text-mo-muted dark:text-gray-400 text-sm">
                            {emailEnviado
                                ? 'Revisa tu email para continuar'
                                : 'Introduce tu email y te enviaremos instrucciones'}
                        </p>
                    </div>

                    {/* Mensaje */}
                    {message.text && (
                        <div className={`mb-4 p-3 rounded-mo font-ui text-center text-sm font-bold ${message.type === 'success'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {!emailEnviado ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold text-mo-text dark:text-white mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all"
                                    placeholder="tu@email.com"
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Botón enviar */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-mo-sage hover:bg-mo-olive text-white rounded-mo font-bold shadow-mo-soft transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <FaEnvelope size={16} />
                                {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
                            </button>

                            {/* Link volver */}
                            <div className="text-center text-sm text-mo-muted dark:text-gray-400">
                                ¿Recordaste tu contraseña?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="text-mo-sage hover:underline font-bold"
                                >
                                    Volver al inicio
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {/* Instrucciones post-envío */}
                            <div className="p-4 bg-mo-sage/5 dark:bg-mo-sage/10 rounded-mo border border-mo-sage/20">
                                <ul className="text-sm text-mo-text dark:text-white space-y-2 list-disc list-inside">
                                    <li>Revisa tu bandeja de entrada</li>
                                    <li>Busca un email de EstaNoche.es</li>
                                    <li>Haz clic en el enlace para cambiar tu contraseña</li>
                                    <li>Si no lo ves, revisa tu carpeta de spam</li>
                                </ul>
                            </div>

                            {/* Botones */}
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setEmailEnviado(false);
                                        setEmail('');
                                        setMessage({ type: '', text: '' });
                                    }}
                                    className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-mo-text dark:text-white rounded-mo font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                >
                                    Enviar a otro email
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-mo-text dark:text-white rounded-mo font-bold hover:bg-gray-50 dark:hover:bg-gray-750 transition-all"
                                >
                                    Volver al inicio
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RecuperarPassword;
