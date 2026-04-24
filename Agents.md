# Protocolo de Desarrollo Antigravity (Optimización de Costes)

## 1. Modo de Operación: "Consulta Primero"
- **REGLA DE ORO:** Está estrictamente prohibido generar bloques de código, archivos completos o realizar instalaciones (`npm install`) sin una orden explícita de "EJECUTAR" o "IMPLEMENTAR".
- Ante cualquier duda, responde con texto explicativo o pseudocódigo breve. 
- Si detectas que una tarea requerirá un escaneo masivo de archivos, advierte al usuario del coste de tokens antes de proceder.

## 2. Gestión de Modelos y Economía
- **FILTRO DE EFICIENCIA:** Si la tarea es de mantenimiento (documentación, cambios de CSS menores, renombrado de variables), sugiere al usuario cambiar a **Gemini 3 Flash**.
- Reserva **Gemini 3.1 Pro** exclusivamente para lógica compleja, depuración de errores de red (como el 503 detectado el 23-04-2026) o cambios arquitectónicos.

## 3. Memoria Viva (session_bitalora.md)
- **SINCRONIZACIÓN:** Al abrir la sesión, lee obligatoriamente `session_bitalora.md` para entender el punto exacto de desarrollo.
- **ACTUALIZACIÓN POR HITO:** No actualices la bitácora tras cada pequeño cambio. Solo se escribirá en ella:
  1. Al finalizar una funcionalidad (ej: Restyling completo de un componente).
  2. Cuando el usuario lo pida explícitamente con "Check-point".
  3. Al detectar un error de infraestructura (como saturación de modelo) para dejar constancia.

## 4. Contexto del Proyecto Actual
- **FOCO:** Desarrollo de PWA con React.
- **ESTÁNDAR DE CALIDAD:** El módulo de "Entidades" es el referente visual y funcional. El módulo de "Eventos" debe igualar su estética "Premium".
- **HERENCIA:** Mantener siempre la lógica de herencia de datos (dirección, coordenadas) de la Entidad al Evento en `EventoForm.jsx`.
## 5. Autonomía de Ubicación (Modo "Sitio Libre")
- **REGLA DE NEGOCIO:** Un evento NO requiere obligatoriamente una Entidad de la base de datos para existir.
- **COMPORTAMIENTO DE FORMULARIO:** - Si el usuario escribe manualmente en el campo "Dirección" o "Nombre del Lugar", se debe romper el vínculo de herencia automáticamente.
  - Los campos de coordenadas (lat/lng) deben permanecer editables para permitir el ajuste fino manual en localizaciones no registradas.
- **INTEGRIDAD:** Antes de guardar, si no hay `entidad_id`, el agente debe asegurar que los campos mínimos de ubicación (Calle, Ciudad, Coordenadas) estén rellenos manualmente para no generar eventos "huérfanos" de mapa.