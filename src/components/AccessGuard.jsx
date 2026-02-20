import React, { useState, useEffect } from 'react';
import { verifyCode, grantAccess, checkAccess, getDailyCode } from '../utils/security';
import LogoEN from '../assets/LogoEN.png';
import { FaLock, FaArrowRight, FaExclamationCircle } from 'react-icons/fa';

/**
 * Componente que protege a sus hijos requiriendo el código diario.
 */
const AccessGuard = ({ children }) => {
    const [authorized, setAuthorized] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    useEffect(() => {
        // DEV HELPER: Mostrar código en consola
        if (import.meta.env.DEV) {
            console.log('🔐 Clave de acceso para hoy:', getDailyCode());
        }
    }, []);

    useEffect(() => {
        if (checkAccess()) {
            setAuthorized(true);
        }

        // Auto-lock: Limpiar sesión al salir del componente (si se quiere pedir código cada vez)
        return () => {
            sessionStorage.removeItem('estanoche_access');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (verifyCode(code)) {
            grantAccess();
            setAuthorized(true);
            setError('');
        } else {
            setError('Código incorrecto');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    if (authorized) {
        return children;
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: '#0F172A', // Fondo oscuro
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1E2933 0%, #0F172A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'rgba(30, 41, 51, 0.7)',
                backdropFilter: 'blur(20px)',
                padding: '40px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                animation: shake ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'fadeIn 0.5s ease-out',
                margin: '20px'
            }}>
                <style>{`
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

                <img
                    src={LogoEN}
                    alt="EstaNoche"
                    style={{ height: '60px', marginBottom: '24px', filter: 'drop-shadow(0 0 10px rgba(75, 116, 77, 0.3))' }}
                />

                <h2 style={{
                    color: 'white',
                    margin: '0 0 12px 0',
                    fontSize: '24px',
                    fontWeight: '600'
                }}>
                    Acceso Restringido
                </h2>

                <p style={{
                    color: '#94A3B8',
                    marginBottom: '32px',
                    fontSize: '15px',
                    lineHeight: '1.5'
                }}>
                    Acceso restringido a personal autorizado.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                        <FaLock style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#64748B'
                        }} />
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value.toUpperCase());
                                setError('');
                            }}
                            placeholder="Contraseña"
                            style={{
                                width: '100%',
                                padding: '16px 16px 16px 48px',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                border: error ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.2s',
                                boxSizing: 'border-box',
                                letterSpacing: '1px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4B744D'}
                            onBlur={(e) => !error && (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: '#EF4444',
                            fontSize: '14px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            <FaExclamationCircle /> {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={() => window.location.href = '/'}
                            style={{
                                flex: 1,
                                padding: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                        >
                            Volver
                        </button>
                        <button
                            type="submit"
                            style={{
                                flex: 1,
                                padding: '16px',
                                backgroundColor: '#4B744D',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#5D8B60'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#4B744D'}
                        >
                            Acceder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccessGuard;
