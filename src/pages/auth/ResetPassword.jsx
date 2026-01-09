import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaKey, FaEye, FaEyeSlash, FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import '../../styles/core/core-ui-v11.css';

const ResetPassword = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    // Estado del paso: 1 = Enviar Email, 2 = Introducir Código y Nueva Pass
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        email: '',
        code: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // PASO 1: Enviar Código
    const handleSendCode = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        if (!formData.email.trim()) {
            setMessage({ type: 'error', text: 'Introduce tu email' });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/send-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email.toLowerCase() })
            });
            const result = await response.json();

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: '¡Código enviado! Revisa tu bandeja de entrada.'
                });
                // Avanzar al paso 2
                setTimeout(() => {
                    setStep(2);
                    setMessage({ type: '', text: '' }); // Limpiar mensaje para el paso 2
                }, 1500);
            } else {
                setMessage({ type: 'error', text: result.error || 'Error al enviar código' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // PASO 2: Resetear Contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        // Validaciones
        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
            setIsSubmitting(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email.toLowerCase(),
                    code: formData.code,
                    newPassword: formData.password
                })
            });

            const result = await response.json();

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: '¡Contraseña actualizada correctamente! Redirigiendo...'
                });

                // Esperar 2 segundos y redirigir al inicio
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setMessage({
                    type: 'error',
                    text: result.error || 'Error al actualizar la contraseña'
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
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-md mx-auto p-3 md:p-6 flex items-center">
                <div className="w-full p-2">
                    {/* Botón volver */}
                    <button
                        onClick={() => {
                            if (step === 2) {
                                setStep(1);
                                setMessage({ type: '', text: '' });
                            } else {
                                navigate('/');
                            }
                        }}
                        className="mb-4 flex items-center gap-2 text-mo-muted dark:text-gray-400 hover:text-mo-sage transition-colors"
                    >
                        <FaArrowLeft size={14} />
                        <span className="text-sm">{step === 1 ? 'Volver al inicio' : 'Volver atrás'}</span>
                    </button>

                    {/* Título */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-mo-sage/20 dark:bg-mo-sage/30 flex items-center justify-center">
                            {step === 1 ? (
                                <FaEnvelope className="text-mo-sage" size={28} />
                            ) : (
                                <FaKey className="text-mo-sage" size={28} />
                            )}
                        </div>
                        <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white mb-2">
                            {step === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
                        </h1>
                        <p className="text-mo-muted dark:text-gray-400 text-sm">
                            {step === 1
                                ? 'Introduce tu email para recibir un código de recuperación'
                                : `Introduce el código enviado a ${formData.email}`
                            }
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

                    {step === 1 ? (
                        // --- FORMULARIO PASO 1 (EMAIL) ---
                        <form onSubmit={handleSendCode} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-mo-text dark:text-white mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all"
                                    placeholder="tu@email.com"
                                    required
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-mo-sage hover:bg-mo-olive text-white rounded-mo font-bold shadow-mo-soft transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <FaEnvelope size={16} />
                                {isSubmitting ? 'Enviando...' : 'Enviar código'}
                            </button>
                        </form>
                    ) : (
                        // --- FORMULARIO PASO 2 (CÓDIGO Y PASS) ---
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            {/* Email (Readonly) */}
                            <div>
                                <label className="block text-sm font-bold text-mo-text dark:text-white mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    readOnly
                                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-mo font-ui text-mo-muted dark:text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            {/* Código de 6 dígitos */}
                            <div>
                                <label className="block text-sm font-bold text-mo-text dark:text-white mb-2">
                                    Código de recuperación
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all text-center text-2xl letter-spacing-widest"
                                    placeholder="000000"
                                    required
                                    maxLength="6"
                                    pattern="[0-9]{6}"
                                    autoFocus
                                />
                            </div>

                            {/* Nueva Contraseña */}
                            <div>
                                <label className="block text-sm font-bold text-mo-text dark:text-white mb-2">
                                    Nueva contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full p-3 pr-10 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all"
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-mo-muted dark:text-gray-400 hover:text-mo-sage transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar Contraseña */}
                            <div>
                                <label className="block text-sm font-bold text-mo-text dark:text-white mb-2">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full p-3 pr-10 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all"
                                        placeholder="Repite la contraseña"
                                        required
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-mo-muted dark:text-gray-400 hover:text-mo-sage transition-colors"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Botón enviar */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-mo-sage hover:bg-mo-olive text-white rounded-mo font-bold shadow-mo-soft transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <FaKey size={16} />
                                {isSubmitting ? 'Actualizando...' : 'Cambiar contraseña'}
                            </button>
                        </form>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ResetPassword;
