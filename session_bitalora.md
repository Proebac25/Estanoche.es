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

### [2026-02-21] Registro Admin, Bugs de Ficha y Entidades DEMO

### Resumen
Sesión de corrección de bugs en el flujo de registro, guardado de fichas y preparación de datos de prueba para la fase de eventos.

### Cambios Realizados
1. **Flujo de Registro (`AltaUsuario.jsx`)**:
   - Añadido `noValidate` al `<form>` para desactivar validación nativa HTML5 que bloqueaba silenciosamente el submit.
   - Corregida validación de contraseña: el error ahora se incluye en `newErrors` y se muestra en pantalla.

2. **Botón "Reenviar código" (`VerificacionEmail.jsx`)**:
   - Eliminada la condición `tiempoRestante <= 0` del `disabled`. El botón se activa al expirar el timer.

3. **Guardado de Fichas (`FichaC.jsx`, `FichaP.jsx`)**:
   - Error "Cannot coerce the result to a single JSON object" causado por política RLS con cliente anónimo.
   - Fix: guardado redirigido a `/api/update-profile` (service role key, bypass RLS).

4. **Limpieza de BD**:
   - Eliminados usuarios fantasma en `auth.users` mediante SQL directo en Supabase.

5. **Cuenta Superadmin**:
   - Creada cuenta operativa `proebac25@gmail.com` (ID: `fb7a30d4`).
   - Activado `tipo = 'superadmin'` en la BD.

6. **Entidades DEMO**:
   - Creadas 6 entidades asociadas a `miguel.vcd@gmail.com` (2 locales, 2 actividades, 2 amenizadores).

### Próxima Fase — Gestión de Eventos
- La tabla `relaciones_entidades` ya existe con: `entidad_id`, `usuario_id`, `rol`, `es_vip`, `estado`, `configuraciones`.
- **Modelo de permisos acordado**: propietario (creador) + colaboradores (crean/modifican eventos con auditoría).
- La tabla `eventos` existe pero está vacía — revisar columnas antes de empezar.

### Tareas Pendientes
- [ ] Flujo completo de creación y visualización de eventos.
- [ ] Gestión de colaboradores por entidad (via `relaciones_entidades`).
- [ ] Auditoría en eventos: `creado_por`, `modificado_por`.
- [ ] Herencia de dirección/datos de entidad al crear evento.

---

### [2026-02-26] Auditoría y Preparación de BD para Eventos

### Resumen
Sesión profunda de diseño de arquitectura de base de datos para preparar el inminente desarrollo del módulo de Eventos. Se ha asegurado la escalabilidad, el tracking de auditorías de modificación y la viabilidad técnica para guardar un historial de versiones fiel utilizando la tabla de análisis secundaria.

### Cambios Realizados y Decisiones de Arquitectura
1. **Auditoría UI/UX-Friendly (`eventos`)**:
   - Para evitar JOINs costosos al listar eventos, se ha decidido desnormalizar parcialmente los nombres de los responsables.
   - Campos añadidos: `creador_nombre`, `modificador_nombre`, `validador_nombre` (texto plano) además de las llaves foráneas `modificador_id` y `validador_id` (UUIDs).
   - Se ha purgado el esquema de dependencias confusas, eliminando campos como el antiguo `modificado_por` (UUID).

2. **Histórico de Versiones (`eventos_analisis`)**:
   - Se destina la tabla secundaria de estadísticas para que funcione también como **Histórico de Cambios (Versionado)** de cada evento.
   - **Corrección Crítica (NOT NULL)**: Se han eliminado las restricciones de campos obligatorios para promotores y validadores secundarios, los cuales causaban Error 500 al insertar nuevos eventos sin esos perfiles rellenados.
   - **Campos Alienados**: Se incorporaron 12 columnas copiadas de `eventos` a `eventos_analisis` (como la imagen, precio, ubicación textual, origen, coords, etc.) para asegurar que la copia del histórico quede idéntica al original de ese momento. Se añadió un nuevo campo relacional `evento_id` para enlazar cada clon de análisis con su evento originario y `created_at` para trazar la fecha temporal de esa versión.

3. **Estrategia de Ubicaciones / Direcciones Inheritadas**:
   - Si un evento se organiza en un "Local" preexistente (`entidad_local_id`), la interfaz bloqueará sus inputs de dirección y heredará de esa Entidad.
   - Como decisión clave de persistencia: aunque haya un local vinculado con ID, se copiarán sus valores textuales (`calle` y `numero`) al campo `ubicacion` del evento en la creación, actuando como *fotografía histórica*. Si la sala se muda dentro de tres años, los eventos pasados permanecerán intactos mostrando dónde sucedieron de verdad en ese instante temporal.

---

### [2026-04-02] Refinamiento UI/UX de Entidades y Optimización de Roles

### Resumen
Sesión enfocada en una reingeniería de la experiencia de usuario (UX) para el promotor, acortando clics y estandarizando la terminología del negocio para alinearla al modelo de datos del sector. También se optimizó radicalmente el diseño responsive.

### Cambios Realizados
1. **Flujo y Navegación del Promotor**:
   - Creación de eventos 1-click: Se permite la creación de eventos inyectando el componente nativo directamente sin listas intermedias farragosas en el panel.
   - Acceso Inteligente: Los paneles de listar entidades ahora abren el "Perfil Público" en primera instancia en vez del backoffice, fomentando el uso de la edición sólo cuando es necesario y reduciendo la tasa de accidentes.
   - Listados A-Z implementados transversalmente.

2. **Reingeniería de Entidades y Terminología**:
   - Para no solapar con el módulo de Eventos, el tipo "Actividad Social" pasó a llamarse **"Organizador / Promotora"**. 
   - Se añadió un nuevo campo **"Tipo"** (`categoria_entidad`) de texto libre, tras descartar la columna legacy `rol_entidad` que estaba bloqueada por restricciones CHECK obsoletas.
   - Los placeholders ahora guían (ej. "Ej: Promotora, Asociación...") para que los perfiles públicos queden clasificados de lujo.

3. **Cero Cajas de Galería Vacías**:
   - Eliminados por hardware los "espacios punteados + vacíos" que estiraban brutalmente la vista en Smartphones obligando a bajar tras la galería, dejando el componente de Subida Minimalista.

4. **Eventos - Herencia de Datos en Bucle Activo**:
   - Configurado en `EventoForm.jsx` para que detecte al vuelo la "Entidad Organizadora" y autogenere/aplique la calle, ciudad y coordenadas heredándolas transparentemente si la entidad es un local físico.

### Próximos Pasos (Pendientes)
- [ ] **Restyling Eventos**: Rediseñar las vistas públicas de Eventos (`EventosList`, `EventoDetalle`) dotándolas de las mismas capacidades estéticas y arquitectónicas "Premium" aplicadas a la nueva Ficha de Entidad.
- [ ] Enlace cruzado real entre el banner visual del Evento y las tarjetas vinculadas de sus Productores/Locales.

---

### [2026-04-23] Infraestructura y Refinamiento "Sitio Libre"

### Resumen
Sesión marcada por errores de infraestructura (503) y la necesidad de flexibilizar la creación de eventos para perfiles que no son propietarios de locales (ej. Animadores, Rutas Turísticas).

### Errores Detectados
### Tareas Realizadas
- [x] **QuickLocalModal & QuickAmenizadorModal**: Implementados modales para creación rápida de sitios y artistas sobre la marcha.
- [x] **Rediseño EventoForm (Modo Animador Pro)**:
    *   **Filtros de Ubicación**: Provincia (desplegable España) y Ciudad (autocompletado) movidos al inicio.
    *   **Participantes**: Eliminado campo Promotor; añadido selector de Animador con botón `+`.
    *   **Google Maps**: Sustituidas coordenadas manuales por campo para enlace directo de Google Maps.
- [x] **Estandarización Geográfica Universal**:
    *   Implementación de `GeographyInputs.jsx` en `EventoForm`, `EntidadForm`, `QuickLocalModal`, `FichaP` y `FichaC`.
    *   Normalización de flujos: Siempre Provincia primero, luego Localidad.
- [x] **Lógica de Verificación**: Reforzada la regla "Sin email no hay verificación" para todas las nuevas entidades creadas.

### Decisiones de Arquitectura: Modo "Sitio Libre" (V2)
1.  **Prioridad de Ubicación**: El formulario ahora guía al usuario desde lo general (Provincia) a lo específico (Local), filtrando la búsqueda dinámicamente.
2.  **Entidades Provisionales**: Tanto locales como artistas creados sobre la marcha nacen como "No Verificados", permitiendo al animador trabajar sin bloqueos.
3.  **Simplificación UX**: Se elimina la carga cognitiva de latitud/longitud en favor de enlaces de Google Maps.
4.  **Estándar de Direcciones**: Todas las direcciones en todos los formularios deben seguir estrictamente el orden: **Provincia / Localidad / CP**.
5.  **Integridad de CP**: Al ingresar el Código Postal, el sistema debe validar que los 2 primeros dígitos coincidan con el prefijo oficial de la Provincia seleccionada (ej: 28 para Madrid, 11 para Cádiz).

### Próximos Pasos
- [ ] **Restyling EventosList**: Llevar la estética "Premium" a la vista pública de eventos.
- [ ] **Flujo de Reclamación**: Implementar la lógica para que los locales puedan reclamar sus perfiles provisionales para dueños reales.
- [ ] **Restyling Vistas Públicas**: Adaptar `EventosList` y `EventoDetalle` al diseño premium.
- [ ] Conexión del enlace de Google Maps con la visualización en el mapa (extracción de coordenadas desde la URL si es posible).

### [2026-04-23] Estandarización Geográfica y Corrección de Constraints

### Resumen
Se ha completado la transición del sistema de geolocalización basado en coordenadas manuales a un modelo basado exclusivamente en Google Maps URLs. También se han resuelto errores críticos de inserción en la base de datos relacionados con restricciones de estado.

### Cambios Realizados
1.  **Limpieza de Coordenadas (Ajuste Fino)**:
    *   Eliminados los campos de latitud (`lat`) y longitud (`lng`) de todos los formularios (`QuickLocalModal.jsx`, `EventoForm.jsx`).
    *   La plataforma ahora confía plenamente en la `google_maps_url` para la navegación y visualización de ubicaciones.
2.  **Corrección de Error de Inserción (`entidades`)**:
    *   **Error**: `violates check constraint "entidades_estado_entidad_check"`.
    *   **Solución**: Se identificó que solo los valores `'pendiente'`, `'verificado'` y `'rechazado'` (en minúsculas) son permitidos por la base de datos. Se estandarizó el uso de `'verificado'` para nuevas entidades creadas por promotores.
    *   Afectados: `EntidadForm.jsx`, `QuickLocalModal.jsx`, `QuickAmenizadorModal.jsx`.
3.  **Mejoras en Herencia de Datos**:
    *   `EventoForm.jsx`: Corregida la carga de entidades del usuario para incluir `google_maps_url` (mapeada a `direccion`) y `codigo_postal` en la herencia automática al seleccionar un local.
    *   Eliminado el envío del campo obsoleto `coordenadas` en el payload de eventos, optimizando la inserción.

### [2026-04-23] Protocolo de Direcciones y Nuevo Flujo de Selección

### Estándar de Visualización de Direcciones
Se establece un nuevo orden de prioridad y visualización para todas las fichas, listas y búsquedas:
**[Provincia] [Localidad] [Nombre del Lugar/Entidad]**
*   Este orden debe respetarse en los títulos de las previews y en los encabezados de las fichas.
*   La dirección sirve como filtro primario de navegación.

### Rediseño del Flujo de Creación de Eventos / Inclusión de Amenizadores
1.  **Filtro Previo**: Antes de seleccionar el nombre, el usuario debe elegir **Provincia** y **Localidad**.
2.  **Ventana de Selección**: Se implementará un selector tipo modal (similar a `QuickLocalModal`) donde:
    *   Se muestran los locales/amenizadores filtrados por la ubicación ya seleccionada.
    *   Si la entidad existe, se selecciona y hereda el resto de datos.
    *   Si no existe, el botón `+` abre el **Registro Provisional**, heredando automáticamente la Provincia y Localidad ya introducidas.
3.  **Persistencia de Mapas (Workaround de Esquema)**:
    *   Debido a la ausencia de la columna `google_maps_url` en el cache del esquema:
        *   En **`entidades`**, se usará la columna **`direccion`** para almacenar la URL de Maps (ya que calle/número/ciudad tienen sus propias columnas).
        *   En **`eventos`**, se usará la columna **`url_evento`** para este fin.

### Tareas Pendientes
*   [ ] Re-mapear `google_maps_url` a `direccion` (`entidades`) y `url_evento` (`eventos`) en todo el código.
*   [ ] Implementar el nuevo `EntitySelectorModal` para la creación de eventos.
*   [ ] Ajustar el orden de visualización en `EntidadesList`, `EventosList` y fichas de detalle.

---

### [2026-04-24] Depuración Crítica de Infraestructura (Triggers y Vistas)

### Resumen
Resolución de una cadena de errores críticos de base de datos ("Errores 500 / 22P02") que bloqueaban por completo la publicación de eventos. Se aislaron los problemas demostrando que el origen no era el frontend (React), sino una serie de triggers y vistas legacy en Supabase que corrompían los tipos de datos en el momento de la inserción.

### Errores de Infraestructura Resueltos
1.  **Bug UUID en Auditoría (Trigger `registrar_o_actualizar_evento_analisis`)**:
    *   **Error**: `invalid input syntax for type uuid: "miguelgd"`.
    *   **Causa**: El trigger usaba variables `%ROWTYPE` (ej. `usuarios%ROWTYPE`) pero solo seleccionaba una columna (`nombre_usuario`). Postgres intentaba insertar ese texto en la primera columna del rowtype (`id`, que es UUID).
    *   **Solución**: Se reescribió el trigger declarando variables de tipo `text` puras para almacenar y traspasar los nombres de auditoría correctamente.
2.  **Conflicto de Tipos en Vistas (Tabla `eventos_analisis`)**:
    *   **Error**: `column "entidad_ciudad" is of type ciudad but expression is of type text`.
    *   **Causa**: La tabla principal `entidades` había abandonado el Enum `ciudad` por texto libre, pero la tabla de análisis y su vista asociada (`vw_eventos_analisis`) seguían ancladas al tipo antiguo.
    *   **Solución**: Se implementó un script SQL avanzado (`DO $$`) para copiar la definición de la vista en memoria, eliminarla, alterar la columna a `text`, y recrear la vista automáticamente, burlando el bloqueo de dependencias de Postgres.
3.  **Trigger Fantasma y Enum VIP (`fn_copy_evento_to_h`)**:
    *   **Error 1**: `invalid input value for enum visibilidad_evento: "VIP"`.
    *   **Error 2**: `relation "eventos_h" does not exist`.
    *   **Causa**: Un trigger legacy intentaba copiar los eventos a una tabla de historial (`eventos_h`) que ya no existía. Además, contenía un error de sintaxis en un condicional `IN ('publico', 'VIP')` que forzaba a Postgres a castear 'VIP' (mayúsculas) contra un Enum que solo aceptaba minúsculas, petando instantáneamente.
    *   **Solución**: Eliminación total del trigger fantasma (`DROP TRIGGER trg_eventos_h_sync`), despejando definitivamente el flujo de inserción.

### Estado Actual
El flujo de **Creación de Eventos** vuelve a ser 100% operativo, transmitiendo la auditoría completa (`creador_nombre`, `modificador_nombre`) y superando todas las validaciones de base de datos sin errores de sintaxis.
