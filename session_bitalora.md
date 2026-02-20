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

### [2026-01-11] Rediseño Premium y Validaciones de Imagen

### Resumen
Se ha transformado la "Ficha de Entidad" en una experiencia visual premium y se han establecido controles estrictos de peso para las imágenes aportadas por los usuarios para mantener el rendimiento de la plataforma.

### Cambios Realizados
1.  **Sistema de Validación de Imágenes**:
    *   Creado `src/utils/validators.js` con límites centralizados:
        *   **500KB**: Perfiles de entidades, promotores y clientes.
        *   **256KB**: Carteles de eventos, conciertos y actividades.
    *   Implementada validación en tiempo real en la selección de archivos para `EntidadForm.jsx`, `EventoForm.jsx`, `FichaP.jsx` y `FichaC.jsx`.

2.  **Ficha de Entidad Premium**:
    *   **EntidadDetalle.jsx**: Rediseño completo inspirado en la página "Sobre". Incluye banner HD, avatar superpuesto, botones de redes sociales integrados y visualización de eventos en tarjetas modernas.
    *   **EntidadForm.jsx**: Actualizado para soportar la carga de Banner y Avatar de alta calidad (máx 500KB total por imagen).

3.  **Gestión de Eventos**:
    *   **EventoForm.jsx**: Creado formulario funcional para la creación de eventos con carga de cartel (máx 256KB).
    *   **Routes.jsx**: Activadas las rutas de eventos para permitir el flujo completo de gestión.

4.  **Ajustes de Perfil**:
    *   Actualizados los perfiles de Promotor (`FichaP.jsx`) y Cliente (`FichaC.jsx`) para unificar el límite de avatar a 500KB y usar el nuevo sistema de validación.

### Tareas Pendientes
*   **PENDIENTE VER**: El usuario aún no ha revisado visualmente la nueva **Ficha de Entidad** (`EntidadDetalle.jsx`).
*   **Subida a Storage**: Implementar la persistencia real de imágenes en Supabase Storage (actualmente se manejan mediante previsualización local/URLs temporales).

### [2026-02-05] Refactorización de Entidades y Galería

### Resumen
Se ha completado la reestructuración del formulario de entidades y el sistema de galería de imágenes, resolviendo múltiples bloqueos técnicos relacionados con la base de datos y la seguridad (RLS).

### Cambios Realizados
1.  **Refactorización del Formulario de Entidades (`EntidadForm.jsx`)**:
    *   **Layout**: El formulario ahora comienza con los datos básicos (Nombre, Tipo, Descripción, Dirección), moviendo la gestión de imágenes (Logo y Galería) al final.
    *   **Gestión Local**: Las imágenes y redes sociales añadidas durante la creación se guardan en el estado local (`pendingGallery`, `socials`) para evitar errores 403. Solo se persisten en Supabase al confirmar la creación.
    *   **Logo Flexible**: Rediseño del contenedor de logotipo a un formato horizontal que utiliza `object-contain`. Esto permite que cualquier logo (vertical, horizontal o cuadrado) se visualice perfectamente sin recortes.

2.  **Infraestructura de Base de Datos (Supabase)**:
    *   **Migración de Esquema**: Se añadieron las columnas `avatar_url`, `banner_url` y `usuario_id` a la tabla `entidades`.
    *   **Galería**: Se creó la tabla `imagenes_entidad` para soportar hasta 5 fotos por entidad, incluyendo lógica de "Imagen Principal" para la portada.
    *   **Seguridad (RLS)**: Se implementaron y corrigieron políticas RLS en `entidades`, `relaciones_entidades`, `imagenes_entidad` y `redes_sociales` para permitir la gestión completa por parte de los creadores (admins).

3.  **Corrección de Errores Críticos**:
    *   **Error 403 (Unauthorized)**: Resuelto al no intentar subir imágenes antes de que la entidad tenga un ID.
    *   **Error 42501 (RLS Violation)**: Solucionado al incluir el `usuario_id` en el payload de creación y ajustar las políticas de Supabase.
    *   **Error 23514 (Check Constraint)**: Corregido el rol de creación a `admin` para cumplir con las restricciones de la tabla `relaciones_entidades`.

4.  **Mejoras en Vistas**:
    *   **EntidadesList.jsx**: Ahora muestra el logotipo real de la entidad.
    *   **EntidadDetalle.jsx**: Adaptado el header para el nuevo logo flexible y mejorada la sección de galería.

### Próximos Pasos (Próxima Sesión)
*   **Gestión de Eventos**: Revisión y refactorización del flujo de creación y visualización de eventos.
*   **Verificación**: Asegurar que la creación de eventos hereda correctamente la dirección y datos de las entidades (especialmente en locales).

### Tareas Pendientes
*   [ ] Refactorización de la ficha de **Eventos**.
*   [ ] Revisión de visualización de eventos en el perfil público de la entidad.

---
