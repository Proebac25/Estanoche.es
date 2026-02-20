/**
 * Utilidades de validación para el proyecto ENE
 */

// Límites de tamaño en KB
export const IMAGE_LIMITS = {
    USUARIO_ENTIDAD: 500, // 500 KB para perfiles de entidades y usuarios
    EVENTO: 256,         // 256 KB para conciertos, actividades y presentaciones
};

/**
 * Valida si un archivo supera el tamaño máximo permitido.
 * @param {File} file - El archivo a validar.
 * @param {number} maxSizeKB - El tamaño máximo en KB.
 * @param {string} entityName - Nombre descriptivo para el mensaje de error.
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateImageSize = (file, maxSizeKB, entityName = "este campo") => {
    if (!file) return { isValid: true, error: null };

    const maxSizeInBytes = maxSizeKB * 1024;
    if (file.size > maxSizeInBytes) {
        return {
            isValid: false,
            error: `Imagen demasiado grande. El límite para ${entityName} es de ${maxSizeKB}KB. (Actual: ${Math.round(file.size / 1024)}KB)`
        };
    }
    return { isValid: true, error: null };
};
