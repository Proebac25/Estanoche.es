// src/utils/security.js

/**
 * Genera el código de acceso diario basado en la fecha.
 * Fórmula: DD + SENE + (Día * Multiplicador)
 * - Día PAR: Multiplicador = 2
 * - Día IMPAR: Multiplicador = 3
 * @returns {string} Código de acceso válido para hoy
 */
export const getDailyCode = () => {
    const today = new Date();
    const day = today.getDate();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Mes 01-12
    const multiplier = day % 2 === 0 ? 2 : 3;
    const value = day * multiplier;

    return `${month}SENE${value}`;
};

/**
 * Verifica si el código proporcionado es correcto.
 * @param {string} code - Código a verificar
 * @returns {boolean} True si es válido
 */
export const verifyCode = (code) => {
    if (!code) return false;
    return code.toUpperCase() === getDailyCode();
};

/**
 * Verifica si el usuario tiene acceso concedido en la sesión actual.
 * @returns {boolean}
 */
export const checkAccess = () => {
    const access = sessionStorage.getItem('estanoche_access');
    if (!access) return false;

    // Opcional: Podríamos guardar la fecha en el storage para invalidar al día siguiente
    // pero sessionStorage se borra al cerrar el navegador, lo cual es suficiente por ahora.
    return access === 'granted';
};

/**
 * Concede acceso al usuario
 */
export const grantAccess = () => {
    sessionStorage.setItem('estanoche_access', 'granted');
};
