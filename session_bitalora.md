# Bitácora de Sesión

## [2026-01-09] Implementación Recuperación de Contraseña

### Resumen
Se ha implementado el flujo completo de recuperación de contraseña ("Forgot Password") integrándolo con el sistema de autenticación existente y el servicio de mensajería (Resend).

### Cambios Realizados
1.  **Frontend**:
    *   **HeaderLand.jsx**:
        *   Añadido enlace "¿Olvidaste tu contraseña?" en el modal de login.
        *   Mejorada la visibilidad del botón "mostrar contraseña" (z-index).
    *   **ResetPassword.jsx**:
        *   Creada página unificada que gestiona todo el proceso en dos pasos:
            1.  Solicitud de código (Email).
            2.  Restablecimiento (Código + Nueva Password).
        *   Validación visual de requisitos de contraseña.
    *   **Routes.jsx**:
        *   Corregida y estandarizada la ruta a `/ResetPassword`.

2.  **Backend (`server.js`)**:
    *   **`/api/send-password-reset`**:
        *   Implementada verificación de existencia del email.
        *   Ahora devuelve error explícito (404) si el email no está registrado, para mejor feedback al usuario.
    *   **`/api/reset-password`**:
        *   Lógica para verificar código y actualizar contraseña en Supabase Auth.

3.  **Mejoras de UX**:
    *   El usuario recibe feedback inmediato si su email no existe.
    *   Flujo fluido sin recargas de página entre enviar código y poner la nueva contraseña.

### Archivos Afectados
- `src/components/HeaderLand.jsx`
- `src/pages/auth/ResetPassword.jsx`
- `src/Routes.jsx`
- `server.js`

### [2026-01-09] Seguridad en Validación de Teléfono

### Cambios Realizados
1.  **Restauración de Lógica**: Se ha vuelto a conectar `VerificacionSMS.jsx` con `security.js` para usar la fórmula de validación basada en la fecha.
2.  **Eliminación de Backdoor**: Se ha eliminado el "Código Maestro" para garantizar que solo el código generado dinámicamente sea válido, aumentando la seguridad.

3.  **Limpieza UI**: Eliminados alertas y mensajes de "[SIMULACIÓN SMS]".
4.  **Corrección Fórmula**: Ajustada la fórmula de validación de móvil a `DD*Mult + YY + MM*Mult` (El año no se multiplica).
5.  **Corrección BD**: Eliminado campo `prefijo_telefono` de la actualización de usuario por no existir en la base de datos (Error `PGRST204`).

### [2026-01-09] Corrección de Errores (Hotfixes)

### Errores Corregidos
1.  **React Hooks en `Sobre.jsx`**:
    *   **Error**: "Rendered fewer hooks than expected".
    *   **Causa**: Renderizado condicional o inestable del array `videos` dentro del componente.
    *   **Solución**: Se movió la definición del array `videos` fuera del componente y se refactorizó el `useEffect` para gestionar mejor el ciclo de vida del video y el autoplay.

2.  **Referencia en `RegistroMovil.jsx`**:
    *   **Error**: `ReferenceError: getPhoneValidationCode is not defined`.
    *   **Causa**: Falta de importación de la función de seguridad.
    *   **Solución**: Añadida la importación correcta desde `../../utils/security`.

### Tareas Pendientes
*   **Revisión Ficha Entidades**: Queda pendiente verificar el funcionamiento y diseño de `EntidadDetalle.jsx` y el flujo de creación de entidades.

---
