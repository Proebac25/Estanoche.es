import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FaTrash, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/core/core-ui-v11.css';

const BajaUsuario = () => {
    const { theme } = useTheme();
    const { user, logout } = useAuth(); // Necesitamos logout para limpiar sesión al final
    const navigate = useNavigate();

    // Evitar crash si user es null (ej: recarga de página)
    if (!user) {
        return <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex items-center justify-center text-mo-text dark:text-white">Cargando...</div>;
    }

    const [step, setStep] = useState(1); // 1: Solicitar código, 2: Introducir código
    const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendCode = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/send-delete-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, userId: user.id })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Error al enviar código');

            setSuccess('Código de seguridad enviado a tu email.');
            setStep(2);
        } catch (err) {
            console.error('Error enviando código:', err);
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        const codeStr = codigo.join('');
        if (codeStr.length !== 6) {
            setError('El código debe tener 6 dígitos');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/confirm-delete-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    userId: user.id,
                    code: codeStr
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Error al eliminar usuario');

            setSuccess('Tu cuenta ha sido eliminada correctamente.');

            // Cerrar sesión y redirigir a home tras unos segundos
            setTimeout(async () => {
                await logout();
                navigate('/');
            }, 3000);

        } catch (err) {
            console.error('Error eliminando usuario:', err);
            setError(err.message || 'Error al procesar la baja');
            setIsSubmitting(false);
        }
    };

    const renderInputs = () => {
        return codigo.map((val, i) => (
            <input
                key={i}
                id={`del-code-${i}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={val}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length > 1) return;
                    const newCode = [...codigo];
                    newCode[i] = value;
                    setCodigo(newCode);
                    if (value && i < 5) document.getElementById(`del-code-${i + 1}`)?.focus();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !codigo[i] && i > 0) {
                        document.getElementById(`del-code-${i - 1}`)?.focus();
                    }
                }}
                className="w-10 h-14 text-center text-xl font-bold bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-red-500 outline-none text-mo-text dark:text-white transition-all mx-1"
                autoFocus={i === 0}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-mo-muted hover:text-mo-text dark:hover:text-white transition-colors mb-6 text-xs font-black uppercase tracking-widest"
                    >
                        <FaArrowLeft />
                        <span>Volver</span>
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500">
                            <FaTrash size={24} />
                        </div>
                        <h1 className="font-display text-2xl font-bold text-red-600 dark:text-red-500">Baja de Usuario</h1>
                        <p className="text-mo-muted dark:text-gray-400 text-sm mt-3 leading-relaxed">
                            Proceso irreversible. Se eliminarán todos tus datos y perfil.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3">
                            <FaExclamationTriangle className="text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-600 dark:text-red-400 font-bold">{error}</p>
                        </div>
                    )}

                    {success && step === 2 && !isSubmitting && (
                        <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 text-xs font-bold text-center rounded-xl">
                            {success}
                        </div>
                    )}

                    {step === 1 ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center">
                                <p className="text-sm font-bold text-mo-text dark:text-white mb-1">{user?.email}</p>
                                <p className="text-xs text-mo-muted">Recibirás un código de seguridad</p>
                            </div>

                            <button
                                onClick={handleSendCode}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-display font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Enviando...' : 'Solicitar Código de Baja'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center space-y-4">
                                <p className="text-sm font-bold text-mo-text dark:text-white uppercase tracking-wider">Introduce el código</p>
                                <div className="flex justify-center">
                                    {renderInputs()}
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmDelete}
                                disabled={isSubmitting || codigo.join('').length < 6}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-display font-black text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Eliminando...' : 'CONFIRMAR ELIMINACIÓN'}
                            </button>

                            <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-mo-muted mb-2">¿No has recibido el correo?</p>
                                <button
                                    onClick={handleSendCode}
                                    disabled={isSubmitting}
                                    className="text-sm font-bold text-red-500 hover:text-red-700 underline disabled:opacity-50"
                                >
                                    Reenviar código de baja
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

export default BajaUsuario;
