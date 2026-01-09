import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaPhoneAlt, FaArrowLeft, FaCheckCircle, FaSms } from 'react-icons/fa';
import '../../styles/core/core-ui-v11.css';
import { supabase } from '../../lib/supabase';
import { getMasterCode, getPhoneValidationCode } from '../../utils/security';
import { usuariosService } from '../../services/usuariosService';

const RegistroMovil = () => {
    const { theme } = useTheme();
    const { user, upgradeToPromoter } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isUpgradeMode = location.state?.upgrade || false;

    const [telefono, setTelefono] = useState(() => {
        // 1. Prioridad: Teléfono pasado por navegación (desde FichaC)
        if (location.state?.telefono) {
            return location.state.telefono.replace(/^(\+34|0034)/, '').replace(/\D/g, ''); // Limpiar prefijo español si viene
        }
        // 2. Fallback: Teléfono del usuario en contexto (si existe y no es dummy)
        if (user?.telefono && user.telefono !== '000000000') {
            return user.telefono.replace(/^(\+34|0034)/, '').replace(/\D/g, '');
        }
        return '';
    });

    // Estado de validación
    const [validacion, setValidacion] = useState({
        loading: false,
        valid: false,
        message: ''
    });

    const [prefijo, setPrefijo] = useState('+34');
    const [codigoInput, setCodigoInput] = useState('');
    const [smsCode, setSmsCode] = useState(''); // Código aleatorio enviado
    const [step, setStep] = useState(1); // 1: introducir teléfono, 2: introducir código
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Validar al montar si ya hay teléfono
    React.useEffect(() => {
        if (telefono && telefono.length === 9) {
            validarTelefono(telefono);
        }
    }, []);

    // Debug log para ver qué llega
    React.useEffect(() => {
        console.log('📱 RegistroMovil mounted with:', {
            statePhone: location.state?.telefono,
            userPhone: user?.telefono,
            finalPhone: telefono
        });
    }, []);

    const validarTelefono = async (tlf) => {
        const telefonoLimpio = tlf.replace(/\s/g, '');

        // 1. Validar Formato
        if (!/^[67]\d{8}$/.test(telefonoLimpio)) {
            setValidacion({
                loading: false,
                valid: false,
                message: 'Debe ser un móvil español válido (Empieza por 6 o 7, 9 dígitos)'
            });
            return false;
        }

        setValidacion(prev => ({ ...prev, loading: true, message: 'Verificando disponibilidad...' }));

        try {
            // 2. Validar Unicidad (solo si es diferente al actual del usuario)
            const esMiNumero = user?.telefono && user.telefono.replace(/\D/g, '').endsWith(telefonoLimpio);

            if (esMiNumero) {
                setValidacion({
                    loading: false,
                    valid: true,
                    message: ''
                });
                return true;
            }

            const resultado = await usuariosService.verificarTelefonoUnico(telefonoLimpio);

            if (resultado.error) throw new Error(resultado.error);

            const existe = resultado.existe === true;

            setValidacion({
                loading: false,
                valid: !existe,
                message: existe ? 'Este teléfono ya está registrado por otro usuario' : ''
            });

            return !existe;

        } catch (error) {
            console.error('Error validando teléfono:', error);
            setValidacion({
                loading: false,
                valid: false,
                message: 'Error al verificar el teléfono'
            });
            return false;
        }
    };

    const handleTelefonoChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 9) value = value.slice(0, 9);
        setTelefono(value);

        if (value.length === 9) {
            validarTelefono(value);
        } else {
            setValidacion({ loading: false, valid: false, message: '' });
        }
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        const telLimpio = telefono.replace(/\s/g, '');

        if (!validacion.valid) {
            // Re-validar por si acaso
            const esValido = await validarTelefono(telLimpio);
            if (!esValido) return;
        }

        setError('');

        // Ya no generamos códigos aleatorios ni mostramos alertas
        // El código válido es el derivado de la fecha

        setStep(2); // Pasar a introducir código
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const telLimpio = telefono.replace(/\s/g, '');

        // Validación: ÚNICAMENTE código basado en fecha
        const validCode = getPhoneValidationCode(telLimpio);

        const isValid = (codigoInput === validCode);

        if (!isValid) {
            setError('Código incorrecto.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const { error: updateError } = await supabase
                .from('usuarios')
                .update({
                    telefono: telLimpio,
                    // prefijo_telefono: prefijo, // Columna no existe en BD
                    telefono_verificado: true,
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
                const updatedUser = { ...user, telefono: telLimpio, prefijo_telefono: prefijo, telefono_verificado: true };
                // Actualizar sesión local si es necesario (depende de tu AuthContext)
                // sessionStorage.setItem('user', JSON.stringify(updatedUser)); 
            }

            setSuccess(true);
            setTimeout(() => {
                if (location.state?.returnPath) {
                    navigate(location.state.returnPath);
                } else if (isUpgradeMode) {
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
                        onClick={() => step === 2 ? setStep(1) : navigate(-1)}
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
                            <h2 className="font-display text-2xl font-bold text-mo-text dark:text-white mb-2">¡Móvil verificado!</h2>
                            <p className="text-mo-muted dark:text-gray-400">Tu número ha sido guardado correctamente. Redirigiendo...</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-mo-olive/10 dark:bg-mo-olive/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#4B744D]">
                                    {step === 1 ? <FaPhoneAlt size={24} /> : <FaSms size={24} />}
                                </div>
                                <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white">
                                    {step === 1 ? 'Registra tu móvil' : 'Introduce el código'}
                                </h1>
                                {step === 1 ? (
                                    <p className="text-mo-muted dark:text-gray-400 text-sm mt-2">
                                        Necesitamos tu teléfono para verificar tu cuenta y permitirte ser promotor.
                                    </p>
                                ) : (
                                    <p className="text-sm text-mo-muted dark:text-gray-400 mb-6">
                                        Hemos enviado un código SMS al {prefijo} {telefono}.<br />
                                        La validación puede tardar unos segundos.
                                    </p>
                                )}
                            </div>

                            {step === 1 ? (
                                // PASO 1: INTRODUCIR TELÉFONO
                                <form onSubmit={handleSendCode} className="space-y-6">
                                    <div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={prefijo}
                                                onChange={(e) => setPrefijo(e.target.value)}
                                                className="w-20 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-center font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4B744D] outline-none"
                                            />
                                            <div className="relative flex-1">
                                                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={telefono}
                                                    onChange={handleTelefonoChange}
                                                    placeholder="612 345 678"
                                                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none transition-all font-ui text-lg text-gray-900 dark:text-white
                                                        ${validacion.valid ? 'border-green-500 focus:border-green-500' :
                                                            validacion.message && !validacion.loading ? 'border-red-500 focus:border-red-500' :
                                                                'border-gray-200 dark:border-gray-700 focus:border-mo-sage'}`}
                                                    maxLength={9}
                                                    autoFocus
                                                />
                                                {validacion.loading && (
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                        <div className="animate-spin h-4 w-4 border-2 border-mo-sage border-t-transparent rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {validacion.message && (
                                            <p className={`text-xs mt-2 ml-1 ${validacion.valid ? 'text-green-500' : 'text-red-500'}`}>
                                                {validacion.message}
                                            </p>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mb-6">
                                            <span>⚠️</span>
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!validacion.valid || validacion.loading}
                                        className={`w-full py-4 rounded-xl font-cta font-bold text-white text-lg shadow-mo-soft transition-all
                                            ${!validacion.valid || validacion.loading
                                                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                                                : 'bg-[#4B744D] hover:bg-[#3d603e] active:scale-[0.98]'}`}
                                    >
                                        Enviar Código SMS
                                    </button>
                                </form>
                            ) : (
                                // PASO 2: INTRODUCIR CÓDIGO (6 DÍGITOS)
                                <form onSubmit={handleVerify} className="space-y-6">
                                    <div className="flex gap-2 justify-center mb-6">
                                        {[...Array(6)].map((_, i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                maxLength={1}
                                                className="w-10 h-12 sm:w-12 sm:h-14 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-center font-bold text-xl sm:text-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4B744D] outline-none"
                                                value={codigoInput[i] || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    const newCode = (typeof codigoInput === 'string' ? codigoInput.split('') : codigoInput) || [];
                                                    // Ensure array is big enough
                                                    while (newCode.length < 6) newCode.push('');

                                                    newCode[i] = val;
                                                    const finalCode = newCode.join('').slice(0, 6);
                                                    setCodigoInput(finalCode);

                                                    if (val && i < 5) {
                                                        const nextInput = e.target.nextElementSibling;
                                                        if (nextInput) nextInput.focus();
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    const currentVal = codigoInput[i];
                                                    if (e.key === 'Backspace' && !currentVal && i > 0) {
                                                        const prevInput = e.target.previousElementSibling;
                                                        if (prevInput) prevInput.focus();
                                                    }
                                                }}
                                                autoFocus={i === 0}
                                            />
                                        ))}
                                    </div>

                                    {error && <p className="text-red-500 text-xs mt-2 font-bold text-center">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-[#4B744D] text-white rounded-2xl font-display font-black text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Verificando...' : 'Verificar e Ir'}
                                    </button>

                                    {/* Botón de reenvío eliminado para evitar mostrar códigos simulados */}
                                </form>
                            )}

                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegistroMovil;
