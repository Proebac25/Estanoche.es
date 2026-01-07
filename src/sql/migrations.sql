-- MIGRATION: 2025-12-03_recreate_vw_eventos_analisis_remove_security_definer.sql
-- Autor: <tu_nombre>
-- Motivo: Eliminar SECURITY DEFINER para respetar RLS y evitar bypass de permisos.
CREATE OR REPLACE VIEW public.vw_eventos_analisis AS
SELECT
  fecha_validacion::date AS fecha,
  anio,
  mes,
  dia_semana,
  entidad_nombre,
  entidad_ciudad,
  categoria_nombre,
  count(*) AS eventos_validados,
  sum(vistas) AS total_vistas,
  sum(clics) AS total_clics
FROM public.eventos_analisis
GROUP BY
  (fecha_validacion::date),
  anio,
  mes,
  dia_semana,
  entidad_nombre,
  entidad_ciudad,
  categoria_nombre;
