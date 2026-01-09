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

/**
 * Genera un código de validación simulado para el móvil.
 * Lógica: Últimos 4 dígitos del teléfono (o '1234' si es corto).
 * @param {string} phone - Número de teléfono
 * @returns {string} Código de 4 dígitos
 */
export const getPhoneValidationCode = (phone) => {
    // Fórmula Universal: DD(x2 o x3)AAMM(x2 o x3)
    // Multiplicador: Par = 2, Impar = 3

    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear() % 100; // 2 dígitos

    const mult = day % 2 === 0 ? 2 : 3;

    // Parte 1: DD * mult
    const p1 = (day * mult).toString().padStart(2, '0');

    // Parte 2: AAMM * mult
    const aamm = year * 100 + month;
    const p2 = (aamm * mult).toString();

    return p1 + p2;
};

/**
 * Verifica el código de móvil.
 * @param {string} phone - Número de teléfono original
 * @param {string} code - Código introducido
 * @returns {boolean}
 */
export const verifyPhoneCode = (phone, code) => {
    return code === getPhoneValidationCode(phone);
};

// Fórmula Oculta (Código Maestro)
// MM(Par*2/Impar*3) + YY + DD(Par*2/Impar*3)
export const getMasterCode = () => {
    const d = new Date();

    // 1. MM * Multiplicador
    const month = d.getMonth() + 1;
    const monthMult = month % 2 === 0 ? 2 : 3;
    const part1 = (month * monthMult).toString().padStart(2, '0');

    // 2. YY
    const year = d.getFullYear().toString().slice(-2);

    // 3. DD * Multiplicador
    const day = d.getDate();
    const dayMult = day % 2 === 0 ? 2 : 3;
    const part3 = (day * dayMult).toString().padStart(2, '0');

    return `${part1}${year}${part3}`;
};
