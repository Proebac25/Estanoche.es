import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaEnvelope, FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';
import '../../styles/core/core-ui-v11.css';
import { usuariosService } from '../../services/usuariosService';

const RegistroEmail = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    // Validar formato y existencia (extraido de AltaUsuario)
    const validarEmail = async (emailValue) => {
        if (!emailValue) return false;

        // 1. Formato
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            setError('Formato de correo inválido');
            setValidationMessage('');
            return false;
        }

        // 2. Unicidad (Backend)
        setIsChecking(true);
        setError('');
        try {
            const resultado = await usuariosService.verificarEmailUnico(emailValue);

            if (resultado.error) throw new Error(resultado.error);

            if (resultado.existe) {
                setError('Este correo ya está registrado');
                setValidationMessage('');
                return false;
            } else {
                setValidationMessage('Correo electrónico válido');
                return true;
            }
        } catch (err) {
            console.error('Error validando email:', err);
            setError('Error al verificar el correo');
            return false;
        } finally {
            setIsChecking(false);
        }
    };

    const handleEmailBlur = () => {
        if (email) validarEmail(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Introduce un email válido');
            return;
        }

        // Re-validar antes de enviar
        const isValid = await validarEmail(email);
        if (!isValid) return;

        setIsSubmitting(true);
        setError('');

        try {
            // Reutilizar lógica de envío de código de AltaUsuario
            // Usamos un objeto userData parcial, suficiente para que el backend envíe el correo
            const userData = {
                ...user,
                email: email.trim().toLowerCase(), // El nuevo email
                email_antiguo: user?.email // Por si el backend lo necesita para logs
            };

            const response = await fetch('/api/send-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userData.email, userData }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar el código de verificación');
            }

            // Redirigir a la pantalla de meter código
            navigate('/VerificacionEmail', {
                state: {
                    email: userData.email, // Importante: pasamos el NUEVO email
                    nombre_usuario: user?.nombre_usuario, // Contexto para la UI
                    telefono: user?.telefono,
                    modo: 'update', // Flag para indicar que es actualización
                    previousRoute: '/RegistroEmail'
                }
            });

        } catch (err) {
            console.error('Error al registrar email:', err);
            setError(err.message || 'Hubo un error al procesar tu solicitud');
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

                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-mo-sage/10 dark:bg-mo-sage/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-mo-sage">
                            <FaEnvelope size={24} />
                        </div>
                        <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white">Actualizar Email</h1>
                        <p className="text-mo-muted dark:text-gray-400 text-sm mt-2">Introduce tu nueva dirección de correo electrónico.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-mo-text dark:text-gray-300 mb-2">
                                Nuevo Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                    setValidationMessage('');
                                }}
                                onBlur={handleEmailBlur}
                                placeholder="tu@nuevo-email.com"
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl font-medium text-lg text-mo-text dark:text-white outline-none focus:ring-2 focus:ring-mo-sage transition-all`}
                                required
                                disabled={isSubmitting}
                            />

                            {/* Mensajes de validación/error */}
                            {isChecking && <p className="text-mo-sage text-xs mt-2 font-bold animate-pulse">Comprobando disponibilidad...</p>}

                            {error && (
                                <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1">
                                    <FaExclamationCircle /> {error}
                                </p>
                            )}

                            {!error && validationMessage && (
                                <p className="text-green-500 text-xs mt-2 font-bold flex items-center gap-1">
                                    ✅ {validationMessage}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !!error || isChecking || !email}
                            className="w-full py-4 bg-mo-sage text-white rounded-2xl font-display font-black text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Enviando...' : 'Continuar'}
                        </button>

                        <p className="text-center text-[10px] text-mo-muted dark:text-gray-500 uppercase tracking-widest font-bold">
                            Te enviaremos un código de verificación
                        </p>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegistroEmail;
